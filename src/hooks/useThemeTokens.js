import { useEffect, useState } from 'react';

const VARIABLE_MAP = Object.freeze({
  primary: '--primary',
  primaryLight: '--primary-light',
  primaryDark: '--primary-dark',
  secondary: '--secondary',
  success: '--status-verified',
  successBg: '--status-verified-bg',
  warning: '--status-pending',
  warningBg: '--status-pending-bg',
  error: '--status-disputed',
  errorBg: '--status-disputed-bg',
  info: '--status-personal',
  infoBg: '--status-personal-bg',
  personal: '--status-personal',
  personalBg: '--status-personal-bg',
  textPrimary: '--text-primary',
  textInverse: '--text-inverse',
  contrastStrong: '--status-contrast-strong',
  contrastSoft: '--status-contrast-soft',
});

const TOKEN_FALLBACKS = Object.freeze({
  primary: '#FF7043',
  primaryLight: '#FF8A65',
  primaryDark: '#F4511E',
  secondary: '#FFAB40',
  success: '#66BB6A',
  successBg: '#E8F5E9',
  warning: '#FFAB40',
  warningBg: '#FFF8E1',
  error: '#FF5252',
  errorBg: '#FFEBEE',
  info: '#42A5F5',
  infoBg: '#E3F2FD',
  personal: '#42A5F5',
  personalBg: '#E3F2FD',
  textPrimary: '#212121',
  textInverse: '#FFFFFF',
  contrastStrong: '#FFFFFF',
  contrastSoft: '#212121',
});

const readCssVariables = () => {
  if (typeof window === 'undefined' || !window.document?.documentElement) {
    return TOKEN_FALLBACKS;
  }

  const computed = window.getComputedStyle(window.document.documentElement);
  const entries = Object.entries(VARIABLE_MAP).map(([key, cssVar]) => {
    const value = computed.getPropertyValue(cssVar).trim();
    return [key, value || TOKEN_FALLBACKS[key]];
  });

  return Object.fromEntries(entries);
};

const useThemeTokens = () => {
  const [tokens, setTokens] = useState(() => readCssVariables());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.document?.documentElement) {
      return undefined;
    }

    const updateTokens = () => setTokens(readCssVariables());
    updateTokens();

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.attributeName === 'data-theme')) {
        updateTokens();
      }
    });

    observer.observe(window.document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    window.addEventListener('themechange', updateTokens);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', updateTokens);
    };
  }, []);

  return tokens;
};

export default useThemeTokens;

