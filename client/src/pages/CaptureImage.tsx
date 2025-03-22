import React, { useRef, useState } from 'react';
import axios from 'axios';

const CaptureImage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera.');
    }
  };

  // Capture an image from the video
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png'); // Convert to Base64
      setCapturedImage(imageData);
    }
  };

  // Upload the captured image
  const uploadImage = async () => {
    if (!capturedImage) return;
    
    setUploading(true);
    
    const blob = await fetch(capturedImage).then(res => res.blob());
    const formData = new FormData();
    formData.append('image', blob, 'captured-image.png');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Capture & Upload Image</h1>
      
      {/* Camera Feed */}
      <div>
        <video ref={videoRef} autoPlay className="w-full max-w-sm border" />
        <button onClick={startCamera} className="mt-2 p-2 bg-blue-500 text-white rounded">Start Camera</button>
      </div>

      {/* Capture Image Button */}
      <button onClick={captureImage} className="mt-4 p-2 bg-green-500 text-white rounded">Capture Image</button>

      {/* Display Captured Image */}
      {capturedImage && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Captured Image:</h2>
          <img src={capturedImage} alt="Captured" className="border w-full max-w-sm" />
          <button 
            onClick={uploadImage} 
            className="mt-4 p-2 bg-purple-500 text-white rounded"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CaptureImage;
