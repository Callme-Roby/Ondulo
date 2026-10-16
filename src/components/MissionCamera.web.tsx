import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { MissionCameraHandle, MissionCameraProps } from './MissionCamera';

/**
 * Web front camera built on getUserMedia. expo-camera is not used on web because its
 * module downloads a QR-code decoder from a CDN as soon as it is imported.
 */
const MissionCamera = forwardRef<MissionCameraHandle, MissionCameraProps>(
  function MissionCamera({ onReady, onUnavailable }, ref) {
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      let stream: MediaStream | null = null;
      let cancelled = false;

      if (!navigator.mediaDevices?.getUserMedia) {
        onUnavailable();
        return;
      }
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((media) => {
          if (cancelled) {
            media.getTracks().forEach((track) => track.stop());
            return;
          }
          stream = media;
          if (video.current) {
            video.current.onloadeddata = () => onReady();
            video.current.srcObject = media;
          }
        })
        // No camera, permission refused, or iframe without allow="camera"
        .catch(() => !cancelled && onUnavailable());

      return () => {
        cancelled = true;
        stream?.getTracks().forEach((track) => track.stop());
      };
    }, []);

    useImperativeHandle(ref, () => ({
      takePicture: async () => {
        const element = video.current;
        if (!element || !element.videoWidth) return null;
        const canvas = document.createElement('canvas');
        canvas.width = element.videoWidth;
        canvas.height = element.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return null;
        // Mirror like the preview, as a selfie camera does
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(element, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.6);
      },
    }));

    return (
      <video
        ref={video}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
        }}
      />
    );
  }
);

export default MissionCamera;
