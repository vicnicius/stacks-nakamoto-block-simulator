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
  mainLight: MutableRefObject<SpotLight>;
  topLight: MutableRefObject<SpotLight>;
}> = ({ mainLight, bottomLight, topLight }) => {
  useHelper(mainLight, SpotLightHelper, "white");
  useHelper(topLight, SpotLightHelper, "yellow");
  useHelper(bottomLight, SpotLightHelper, "purple");
  return null;
};

export const Lights = () => {
  const { debug } = useContext(DebugContext);
  const { height } = useContext(DimensionsContext);
  const topLight = useRef<SpotLight>(new SpotLight());
  const bottomLight = useRef<SpotLight>(new SpotLight());
  const mainLight = useRef<SpotLight>(new SpotLight());

  useEffect(() => {
    mainLight.current.lookAt(0, 0, 0);
    topLight.current.lookAt(0, 0, 0);
    bottomLight.current.lookAt(0, 0, 0);
  }, []);
  return (
    <>
      {debug && (
        <LightHelpers
          topLight={topLight}
          bottomLight={bottomLight}
          mainLight={mainLight}
        />
      )}
      <spotLight
        intensity={10}
        distance={height}
        color={"yellow"}
        position={[0, height / 2, 0]}
        ref={topLight}
      />
      <spotLight
        intensity={10}
        distance={height}
        color={"white"}
        position={[height / 3, height / 3, height / 3]}
        ref={mainLight}
      />
      <spotLight
        intensity={75}
        distance={height}
        color={"#7A40EE"}
        position={[0, -height / 3, height / 3]}
        ref={bottomLight}
      />
    </>
  );
};
