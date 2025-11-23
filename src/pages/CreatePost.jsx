import { postsAPI } from '../services/api';
import { useContentUpload } from '../hooks/useContentUpload';
import CreateContentForm from '../components/CreateContentForm';

const CreatePost = () => {
  const hookResult = useContentUpload(
    'post',
    { create: postsAPI.createPost },
    {
      maxBytes: 20 * 1024 * 1024, // 20 MB
      allowedExt: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
      contentField: 'image',
      contentType: 'image',
      title: 'Create Post',
      analyzeMessage: 'Analyzing image...',
      readyMessage: 'Image analyzed! Ready to post.',
    }
  );

  return (
    <CreateContentForm
      contentType="post"
      title="Create Post"
      icon={
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      fileInputLabel="Choose Image"
      emptyStateIcon={
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      emptyStateText={
        <>
          <strong>No image selected</strong>
          Click to upload or drag and drop
        </>
      }
      placeholder="Analyzing image..."
      captionPlaceholder="Write something about your post..."
      hookResult={hookResult}
    />
  );
};

export default CreatePost;
