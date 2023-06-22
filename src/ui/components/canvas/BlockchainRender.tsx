import { useSpring, animated } from "@react-spring/three";
import React, { FC, useContext, useEffect, useMemo } from "react";
import { Vector3 } from "three";
import { Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { DimensionsContext, blockSpace } from "../../../domain/Dimensions";
import { BlockRender } from "./components/BlockRender";

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX | Chain.BTC>;
  translateY?: number;
}> = ({ chain, translateY }) => {
  const { setMaxYLeftScroll, setMaxYRightScroll, height } =
    useContext(DimensionsContext);
  const blockIds = Object.keys(chain.blocks);
  const maxVerticalPosition = useMemo(() => {
    return blockIds.reduce((acc, id) => {
      const block = chain.blocks[id];
      const { vertical } = block.position;
      return vertical > acc ? vertical : acc;
    }, 0);
  }, [blockIds, chain.blocks]);
  const maxHeight = maxVerticalPosition * blockSpace;
  useEffect(() => {
    if (chain.name === "stacks") {
      setMaxYLeftScroll(maxHeight - height / 3);
    }
    if (chain.name === "bitcoin") {
      setMaxYRightScroll(maxHeight - height / 3);
    }
  }, [maxHeight]);

  const y =
    translateY === undefined || translateY <= 0
      ? 0
      : translateY >= maxHeight
      ? maxHeight
      : translateY;
  // eslint-disable-next-line no-console
  const { position } = useSpring({
    position: [0, y, 0],
    config: { mass: 0.15, tension: 5, friction: 5, precision: 0.0001 },
  });
  const { blocks } = chain;
  return (
    // @TODO: fix this type casting
    <animated.group position={position as unknown as Vector3}>
      {blockIds.map((id) => (
        <BlockRender key={id} block={blocks[id]} id={id} chain={chain} />
      ))}
    </animated.group>
  );
};
