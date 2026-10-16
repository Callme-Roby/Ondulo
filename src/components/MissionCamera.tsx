import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export interface MissionCameraHandle {
  /** Returns the picture URI (kept in memory only), or null on failure. */
  takePicture: () => Promise<string | null>;
}

export interface MissionCameraProps {
  onReady: () => void;
  onUnavailable: () => void;
}

/** Front camera (native). The web version lives in MissionCamera.web.tsx. */
const MissionCamera = forwardRef<MissionCameraHandle, MissionCameraProps>(
  function MissionCamera({ onReady, onUnavailable }, ref) {
    const [permission, requestPermission] = useCameraPermissions();
    const camera = useRef<CameraView>(null);

    useEffect(() => {
      if (!permission || permission.granted) return;
      if (!permission.canAskAgain) {
        onUnavailable();
        return;
      }
      requestPermission()
        .then((result) => {
          if (!result.granted) onUnavailable();
        })
        .catch(onUnavailable);
    }, [permission?.granted, permission?.canAskAgain]);

    useImperativeHandle(ref, () => ({
      takePicture: async () => {
        try {
          const picture = await camera.current?.takePictureAsync({ quality: 0.3 });
          return picture?.uri ?? null;
        } catch {
          return null;
        }
      },
    }));

    if (!permission?.granted) return null;
    return (
      <CameraView
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing="front"
        onCameraReady={onReady}
        onMountError={onUnavailable}
      />
    );
  }
);

export default MissionCamera;
