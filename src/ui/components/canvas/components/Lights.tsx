import { useHelper } from "@react-three/drei";
import React, {
  FC,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SpotLight, SpotLightHelper } from "three";
import { DebugContext } from "../../../../domain/Debug";
import { DimensionsContext } from "../../../../domain/Dimensions";

const LightHelpers: FC<{
  bottomLight: MutableRefObject<SpotLight>;
}> = ({ bottomLight }) => {
  useHelper(bottomLight, SpotLightHelper, "purple");
  return null;
};

export const Lights = () => {
  const { debug } = useContext(DebugContext);
  const { height } = useContext(DimensionsContext);
  const bottomLight = useRef<SpotLight>(new SpotLight());

  useEffect(() => {
    bottomLight.current.lookAt(0, 0, 0);
  }, []);
  return (
    <>
      {debug && <LightHelpers bottomLight={bottomLight} />}
      <ambientLight intensity={6.5} />
      <spotLight
        intensity={200}
        distance={height * 2}
        decay={1.5}
        color={"#291F9B"}
        position={[0, -height, height]}
        ref={bottomLight}
      />
    </>
  );
};
