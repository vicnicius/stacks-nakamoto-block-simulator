import { Html } from "@react-three/drei";
import { range } from "lodash";
import React, { FC, useContext } from "react";
import { UiStateContext } from "../../../../UiState";
import { Chain } from "../../../../domain/Block";
import { BlockActionType } from "../../../../domain/BlockAction";
import "./BulkActions.css";

interface BulkActionsProps {
  position: [x: number, y: number, z: number];
}

export const BulkActions: FC<BulkActionsProps> = ({ position }) => {
  const { dispatch } = useContext(UiStateContext);
  const handleMineClick = () => {
    dispatch({
      type: BlockActionType.MINE,
      // Hardcoded while we only allow mining on STX
      chain: Chain.STX,
    });
  };

  const handleMineSixClick = () => {
    range(0, 6).forEach(() => {
      dispatch({
        type: BlockActionType.MINE,
        // Hardcoded while we only allow mining on STX
        chain: Chain.STX,
      });
    });
  };

  const handleMineOneHundredClick = () => {
    range(0, 100).forEach(() => {
      dispatch({
        type: BlockActionType.MINE,
        // Hardcoded while we only allow mining on STX
        chain: Chain.STX,
      });
    });
  };
  return (
    <Html position={position}>
      <div className="BulkActionsWrapper">
        <button className="BulkActionButton" onClick={handleMineClick}>
          Mine +1
        </button>
        <button className="BulkActionButton" onClick={handleMineSixClick}>
          Mine +6
        </button>
        <button
          className="BulkActionButton"
          onClick={handleMineOneHundredClick}
        >
          Mine +100
        </button>
      </div>
    </Html>
  );
};
