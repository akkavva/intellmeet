import { useState } from 'react';

interface Props {
  onEndMeeting: () => void;
}

const MeetingControls = ({ onEndMeeting }: Props) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);

  const toggleScreenShare = async () => {
    try {
      if (!isSharing) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsSharing(true);
      } else {
        setIsSharing(false);
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('Recording started...');
    } else {
      console.log('Recording stopped...');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center gap-4">

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
          isMuted ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
        }`}
      >
        <span className="text-xl">{isMuted ? '🔇' : '🎤'}</span>
        <span className="text-xs text-white">
          {isMuted ? 'Unmute' : 'Mute'}
        </span>
      </button>

      {/* Video Button */}
      <button
        onClick={toggleVideo}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
          isVideoOff ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
        }`}
      >
        <span className="text-xl">{isVideoOff ? '📵' : '📹'}</span>
        <span className="text-xs text-white">
          {isVideoOff ? 'Start Video' : 'Stop Video'}
        </span>
      </button>

      {/* Screen Share Button */}
      <button
        onClick={toggleScreenShare}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
          isSharing ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
        }`}
      >
        <span className="text-xl">🖥️</span>
        <span className="text-xs text-white">
          {isSharing ? 'Stop Share' : 'Share Screen'}
        </span>
      </button>

      {/* Recording Button */}
      <button
        onClick={toggleRecording}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
          isRecording ? 'bg-red-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'
        }`}
      >
        <span className="text-xl">⏺️</span>
        <span className="text-xs text-white">
          {isRecording ? 'Stop Rec' : 'Record'}
        </span>
      </button>

      {/* End Meeting Button */}
      <button
        onClick={onEndMeeting}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
      >
        <span className="text-xl">📵</span>
        <span className="text-xs text-white">End</span>
      </button>

    </div>
  );
};

export default MeetingControls;