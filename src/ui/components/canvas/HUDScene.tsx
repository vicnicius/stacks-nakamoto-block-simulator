import { Hud } from "@react-three/drei";
import React, { FC } from "react";
import { Camera } from "./components/Camera";
import { DividerLine } from "./components/DividerLine";
import { Title } from "./components/Title";

export const HUDScene: FC = () => {
  return (
    <Hud>
      <Camera />
      <Title />
      <DividerLine />
    </Hud>
  );
};
