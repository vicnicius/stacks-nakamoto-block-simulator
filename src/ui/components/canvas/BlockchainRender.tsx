import { useSpring, animated } from "@react-spring/three";
import React, { FC } from "react";
import { Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { BlockRender } from "./components/BlockRender";

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX | Chain.BTC>;
  translateY?: number;
}> = ({ chain }) => {
  const [springs] = useSpring(() => ({ position: [0, 0] }));
  const { blocks } = chain;
  return (
    <animated.group position={springs.position.to((x, y) => [x, y, 0])}>
      {Object.keys(blocks).map((id) => (
        <BlockRender key={id} block={blocks[id]} id={id} chain={chain} />
      ))}
    </animated.group>
  );
};
