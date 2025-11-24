import { reelsAPI } from '../services/api';
import { useContentUpload } from '../hooks/useContentUpload';
import CreateContentForm from '../components/CreateContentForm';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const CreateReel = () => {
  const hookResult = useContentUpload(
    'reel',
    { create: reelsAPI.createReel },
    {
      maxBytes: 100 * 1024 * 1024, // 100 MB
      allowedExt: ['mp4', 'mov', 'avi', 'webm'],
      contentField: 'video',
      contentType: 'video',
      title: 'Create Reel',
      analyzeMessage: 'Analyzing video...',
      readyMessage: 'Video analyzed! Ready to post.',
    }
  );

  return (
    <CreateContentForm
      contentType="reel"
      title="Create Reel"
      icon={<VideoLibraryIcon />}
      fileInputLabel="Choose Video"
      emptyStateIcon={<VideoLibraryIcon />}
      emptyStateText={
        <>
          <strong>No video selected</strong>
          Click to upload or drag and drop<br />
          MP4, MOV, AVI, WEBM (max 100MB)
        </>
      }
      placeholder="Analyzing video..."
      captionPlaceholder="Write something about your reel..."
      hookResult={hookResult}
    />
  );
};

export default CreateReel;
