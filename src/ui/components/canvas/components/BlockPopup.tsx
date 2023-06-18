import { animated, useSpring } from "@react-spring/web";
import { Html } from "@react-three/drei";
import React, { FC } from "react";
import "./BlockPopup.css";

interface BlockPopupProps {
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  isHovering: boolean;
  position: [x: number, y: number, z: number];
}

export const BlockPopup: FC<BlockPopupProps> = ({
  handleMouseEnter,
  handleMouseLeave,
  isHovering,
}) => {
  const revealSprings = useSpring({
    maxWidth: isHovering ? 230 : 0,
    maxHeight: isHovering ? 136 : 0,
  });
  return (
    <Html>
      <animated.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="BlockPopup"
        style={{ ...revealSprings }}
      >
        <ul className="BlockPopupList">
          <li className="BlockPopupListItem">Mine</li>
        </ul>
      </animated.div>
    </Html>
  );
};
