import { Billboard, Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group, MathUtils, Vector3 } from "three";
import { UiStateContext } from "../../../UiState";
import { Block, Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { SceneContext, blockSpace } from "../../../domain/SceneContext";
import { BlockRender } from "./components/BlockRender";
import { ScrollContext } from "./components/ScrollContext";
import { getAnchorsFromPosition } from "./components/blockRenderHelper";

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX | Chain.BTC>;
}> = ({ chain }) => {
  const ref = useRef<Group>(null);
  const y = useRef(0);
  const [to, setTo] = useState<number | null>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const [maxScroll, setMaxScroll] = useState(0);
  const { state } = useContext(UiStateContext);
  const { height, width, zoom } = useContext(SceneContext);
  const blockIds = Object.keys(chain.blocks);
  const maxVerticalPosition = useMemo(() => {
    return blockIds.reduce((acc, id) => {
      const block = chain.blocks[id];
      const { vertical } = block.position;
      return vertical > acc ? vertical : acc;
    }, 0);
  }, [blockIds, chain.blocks]);

  const maxHeight = maxVerticalPosition * blockSpace;
  const planePosition =
    chain.name === "stacks"
      ? [-width / 2, 0, -width / 2]
      : [width / 2, 0, -width / 2];

  useFrame(() => {
    if (isScrollLocked && to !== null) {
      if (!ref.current?.position) return;
      const newPositionY = MathUtils.lerp(ref.current.position.y, to, 0.075);
      ref.current.position.y = newPositionY;
    }
  });

  const automaticScrollToBlock = useCallback(
    (block: Block, chain: Chain) => {
      if (!isScrollLocked) return;
      const [, y] = getAnchorsFromPosition(
        block.position,
        width,
        height,
        chain,
        zoom
      );

      if (
        ref.current?.position.y !== undefined &&
        -y + blockSpace > ref.current?.position.y
      ) {
        setTo(-y + blockSpace);
      }
    },
    [isScrollLocked]
  );

  const handleScroll = useCallback(
    ({ deltaY }: { deltaY: number }) => {
      if (!ref.current?.position) return;

      setIsScrollLocked(false);
      const newY = ref.current.position.y + deltaY;
      if (newY < -100) {
        return;
      }
      if (newY <= maxScroll) {
        const newPositionY = MathUtils.lerp(
          ref.current.position.y,
          newY,
          0.075
        );
        ref.current.position.y = newPositionY;
        y.current = newPositionY;
      }
      if (newY + 10 >= maxScroll) {
        setIsScrollLocked(true);
      }
    },
    [maxScroll]
  );

  useEffect(() => {
    if (chain.name === "bitcoin" && state.present.lastId > 2) {
      automaticScrollToBlock(
        chain.blocks[state.present.lastId - 1],
        chain.name
      );
    }
  }, [chain.name, chain.blocks, state.present.lastId, automaticScrollToBlock]);

  useEffect(() => {
    setMaxScroll((maxHeight - height / 3) / zoom);
  }, [maxHeight]);

  const { blocks } = chain;
  return (
    <ScrollContext.Provider
      value={{
        automaticScrollToBlock,
      }}
    >
      <group
        onWheel={({ deltaY }) =>
          handleScroll({
            deltaY,
          })
        }
      >
        <Billboard>
          <Plane
            args={[width, height]}
            position={planePosition as unknown as Vector3}
            material-color={"#242424"}
          />
        </Billboard>
        <group ref={ref}>
          {blockIds.map((id) => (
            <BlockRender key={id} block={blocks[id]} id={id} chain={chain} />
          ))}
        </group>
      </group>
    </ScrollContext.Provider>
  );
};
