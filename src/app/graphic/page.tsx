'use client';
import { useRef, useState } from 'react';

export default function Graphic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL('image/png'));
  };
  
  return (
    <div>
      <button onClick={startCamera}>Abrir Cámara</button>
      <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
      <button onClick={takePhoto}>Tomar Foto</button>

      {photo && (
        <div>
          <h3>Foto tomada:</h3>
          <img src={photo} alt="captura" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}
