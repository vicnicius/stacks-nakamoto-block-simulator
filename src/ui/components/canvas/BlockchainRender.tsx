import { animated } from "@react-spring/three";
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Group } from "three";
import { Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { SceneContext, blockSpace } from "../../../domain/SceneContext";
import { BlockRender } from "./components/BlockRender";

const BlockchainRenderCore: ForwardRefRenderFunction<
  Group,
  {
    chain: Blockchain<Chain.STX | Chain.BTC>;
  }
> = ({ chain }, ref) => {
  const { setMaxYLeftScroll, setMaxYRightScroll, height, zoom } =
    useContext(SceneContext);
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
      setMaxYLeftScroll((maxHeight - height / 3) / zoom);
    }
    if (chain.name === "bitcoin") {
      setMaxYRightScroll((maxHeight - height / 3) / zoom);
    }
  }, [maxHeight]);

  const { blocks } = chain;
  return (
    <animated.group ref={ref}>
      {blockIds.map((id) => (
        <BlockRender key={id} block={blocks[id]} id={id} chain={chain} />
      ))}
    </animated.group>
  );
};

export const BlockchainRender = forwardRef(BlockchainRenderCore);
