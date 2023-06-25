import { animated, useSpring } from "@react-spring/web";
import { Html } from "@react-three/drei";
import React, { FC, useContext } from "react";
import "./BlockPopup.css";
import { UiStateContext } from "../../../../UiState";
import { Chain } from "../../../../domain/Block";
import { BlockActionType } from "../../../../domain/BlockAction";

interface BlockPopupProps {
  hasChildren: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  visible: boolean;
  position: [x: number, y: number, z: number];
  blockId: string;
  chain: Chain;
}

export const BlockPopup: FC<BlockPopupProps> = ({
  blockId,
  chain,
  hasChildren,
  handleMouseEnter,
  handleMouseLeave,
  visible,
}) => {
  const { dispatch } = useContext(UiStateContext);
  const revealSprings = useSpring({
    maxWidth: visible ? 260 : 0,
    borderWidth: visible ? 1 : 0,
  });
  return (
    <Html>
      <animated.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="BlockPopup"
        style={{
          ...revealSprings,
        }}
      >
        <ul
          className="BlockPopupList"
          onClick={() =>
            dispatch({
              type: hasChildren ? BlockActionType.FORK : BlockActionType.MINE,
              targetBlockId: blockId,
              chain,
            })
          }
        >
          <li className="BlockPopupListItem">
            {hasChildren ? "Fork" : "Mine"}
          </li>
        </ul>
      </animated.div>
    </Html>
  );
};
