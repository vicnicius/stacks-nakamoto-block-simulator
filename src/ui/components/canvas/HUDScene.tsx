import { Hud } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { DimensionsContext } from "../../../domain/Dimensions";
import { BulkActions } from "./components/BulkActions";
import { Camera } from "./components/Camera";
import { DividerLine } from "./components/DividerLine";
import { Title } from "./components/Title";
import { layout } from "./helpers";

export const HUDScene: FC = () => {
  const { width, height } = useContext(DimensionsContext);
  const stacksTitlePosition: [number, number, number] = [
    -layout.defaultMargin / 2,
    height / 2,
    0,
  ];
  const bitcoinTitlePosition: [number, number, number] = [
    layout.defaultMargin / 2,
    height / 2,
    0,
  ];
  const bulkActionPosition: [number, number, number] = [
    -width / 4,
    -height / 2 + layout.defaultMargin * 2,
    0,
  ];
  return (
    <Hud>
      <Camera />
      <Title anchor={"right"} position={stacksTitlePosition}>
        Stacks
      </Title>
      <BulkActions position={bulkActionPosition} />
      <DividerLine />
      <Title anchor={"left"} position={bitcoinTitlePosition}>
        Bitcoin
      </Title>
    </Hud>
  );
};
