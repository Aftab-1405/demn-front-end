import { postsAPI } from '../services/api';
import { useContentUpload } from '../hooks/useContentUpload';
import CreateContentForm from '../components/CreateContentForm';
import ImageIcon from '@mui/icons-material/Image';

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
      icon={<ImageIcon />}
      fileInputLabel="Choose Image"
      emptyStateIcon={<ImageIcon />}
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
