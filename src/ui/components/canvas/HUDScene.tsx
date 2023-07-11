import { Html, Hud } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { DimensionsContext } from "../../../domain/Dimensions";
import { BulkActions } from "./components/BulkActions";
import { Camera } from "./components/Camera";
import { DividerLine } from "./components/DividerLine";
import { layout } from "./helpers";
import { ReactComponent as BitcoinLogo } from "./resources/bitcoin-circle.svg";
import { ReactComponent as StacksLogo } from "./resources/stacks-circle.svg";
import "./HUDScene.css";

export const HUDScene: FC = () => {
  const { width, height } = useContext(DimensionsContext);
  const bulkActionPosition: [number, number, number] = [
    -width / 4,
    -height / 2 + layout.defaultMargin * 2,
    0,
  ];
  return (
    <Hud>
      <Camera zoom={1} />
      <Html position={[0, height / 2, 0]}>
        <div className="CanvasTitle">
          <div className="CanvasTitle-stacks">
            <StacksLogo />
            <h2 className="CanvasTitle-text">Stacks</h2>
          </div>
          <div className="CanvasTitle-bitcoin">
            <BitcoinLogo />
            <h2 className="CanvasTitle-text">Bitcoin</h2>
          </div>
        </div>
      </Html>
      <DividerLine />
      <BulkActions position={bulkActionPosition} />
    </Hud>
  );
};
