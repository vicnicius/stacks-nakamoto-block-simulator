import { OrthographicCamera } from "@react-three/drei";
import React, { FC, useEffect, useRef } from "react";
import { OrthographicCamera as ThreeOrtographicCamera } from "three";
import { isometricCameraAngle } from "../../../../domain/SceneContext";

export const Camera: FC<{
  isometric?: boolean;
  zoom?: number;
  fov?: number;
}> = ({ isometric, zoom } = { isometric: false, zoom: 1 }) => {
  const camera = useRef<ThreeOrtographicCamera>();
  useEffect(() => {
    if (camera.current) {
      camera.current.lookAt(0, 0, 0);
    }
  }, []);
  return (
    <OrthographicCamera
      makeDefault
      position={isometric ? [300, 300, 300] : [0, 0, 100]}
      zoom={zoom}
      rotation={isometric ? isometricCameraAngle : [0, 0, 0]}
      ref={camera}
    />
  );
};
