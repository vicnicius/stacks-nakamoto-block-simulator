import { animated, useSpring } from "@react-spring/web";
import { Html } from "@react-three/drei";
import React, { FC, useContext } from "react";
import "./BlockPopup.css";
import { UiStateContext } from "../../../../UiState";
import { Chain } from "../../../../domain/Block";
import { BlockActionType } from "../../../../domain/BlockAction";

interface BlockPopupProps {
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  isHovering: boolean;
  position: [x: number, y: number, z: number];
  blockId: string;
  chain: Chain;
}

export const BlockPopup: FC<BlockPopupProps> = ({
  blockId,
  chain,
  handleMouseEnter,
  handleMouseLeave,
  isHovering,
}) => {
  const { dispatch } = useContext(UiStateContext);
  const revealSprings = useSpring({
    maxWidth: isHovering ? 244 : 0,
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
              type: BlockActionType.MINE,
              targetBlockId: blockId,
              chain,
            })
          }
        >
          <li className="BlockPopupListItem">Mine</li>
        </ul>
      </animated.div>
    </Html>
  );
};
