/**
 * ProcessingSSEClient - Real-time SSE client for post/reel processing updates
 * * FIXED: Handles immediate completion on connection
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export class ProcessingSSEClient {
  constructor(contentType, contentId, token) {
    this.contentType = contentType; // 'post' or 'reel'
    this.contentId = contentId;
    this.token = token;
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000; // 2 seconds
    this.listeners = {
      update: [],
      complete: [],
      error: []
    };
    this.isConnected = false;
  }

  /**
   * Connect to SSE endpoint and start receiving updates
   */
  connect() {
    const endpoint = this.contentType === 'post' ? 'posts' : 'reels';
    const url = `${API_URL}/${endpoint}/${this.contentId}/processing-status/stream?token=${this.token}`;

    console.log(`[SSE] Connecting to ${url}`);

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log(`[SSE] Connected to ${this.contentType} ${this.contentId}`);
      this.isConnected = true;
      this.reconnectAttempts = 0; // Reset on successful connection
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('[SSE] Failed to parse message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      // Don't log error if we just closed it intentionally
      if (this.eventSource?.readyState === EventSource.CLOSED) return;

      console.error('[SSE] Connection error:', error);
      this.isConnected = false;
      this.handleError(error);
    };
  }

  /**
   * Handle incoming SSE messages
   */
  handleMessage(data) {
    const terminalStatuses = ['complete', 'error', 'rejected'];
    const isTerminal = terminalStatuses.includes(data.processing_status);

    // 1. Initial connection message
    if (data.type === 'connected') {
      console.log('[SSE] Initial status:', data);

      // [FIX] Check if it's ALREADY complete upon connection
      if (isTerminal) {
        console.log('[SSE] Job already finished upon connection. Triggering complete.');
        this.emit('update', data); // Update UI one last time (e.g. 100%)
        this.emit('complete', data); // Trigger completion logic
        this.disconnect();
        return;
      }

      this.emit('update', data);
      return;
    }

    // 2. Heartbeat (ignore)
    if (data.type === 'heartbeat') {
      return;
    }

    // 3. Processing update
    this.emit('update', data);

    // 4. Check if processing is complete (Standard flow)
    if (isTerminal) {
      this.emit('complete', data);
      this.disconnect();
    }
  }

  /**
   * Handle SSE errors and implement reconnection logic
   */
  handleError() {
    this.disconnect();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(`[SSE] Reconnecting (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

      setTimeout(() => {
        this.connect();
      }, delay); // Exponential backoff
    } else {
      console.error('[SSE] Max reconnection attempts reached');
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  /**
   * Disconnect from SSE endpoint
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
      // console.log('[SSE] Disconnected'); 
    }
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return this; // Allow chaining
  }

  /**
   * Emit event to all registered listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[SSE] Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }

  /**
   * Check if connected
   */
  get connected() {
    return this.isConnected;
  }
}

export default ProcessingSSEClient;