import { animated, config, useSpring } from "@react-spring/three";
import { Billboard, Box, Edges, Html } from "@react-three/drei";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BoxGeometry, LineSegments, Mesh } from "three";
import { UiStateContext } from "../../../../UiState";
import { Block, Chain, StacksBlockState } from "../../../../domain/Block";
import { BlockActionType } from "../../../../domain/BlockAction";
import { Blockchain } from "../../../../domain/Blockchain";
import { SceneContext, cubeSize } from "../../../../domain/SceneContext";
import { Connections } from "./BlockConnections";
import { Info } from "./Info";
import { ScrollContext } from "./ScrollContext";
import {
  getAnchorsFromPosition,
  getBlockColor,
  getConnections,
  materialCache,
} from "./blockRenderHelper";

const AnimatedGroup = animated.group;
const AnimatedBox = animated(Box);
const AnimatedEdges = animated(Edges);
const boxGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);

function getCursor(isHovering: boolean, block: Block): string {
  if (
    isHovering &&
    block.type === Chain.STX &&
    (block.state === StacksBlockState.NEW ||
      block.state === StacksBlockState.THAWED)
  ) {
    return "pointer";
  }

  if (isHovering && block.type === Chain.STX) {
    return "not-allowed";
  }
  return "auto";
}
export const BlockRender: FC<{
  id: string;
  block: Block;
  chain: Blockchain<Chain.STX | Chain.BTC>;
}> = ({ block, id, chain }) => {
  const blockRef = useRef<Mesh>(null);
  const blockMaterialId = useMemo(
    () => `outer-block-${block.type}-${block.state}`,
    [block.type, block.state]
  );
  const blockMaterial = materialCache.get(blockMaterialId);

  const edgesRef = useRef<LineSegments>(null);
  const edgesMaterialId = "edge";
  const edgesMaterial = materialCache.get(edgesMaterialId);

  const { height, width, zoom } = useContext(SceneContext);
  const { automaticScrollToBlock } = useContext(ScrollContext);
  const { dispatch, state } = useContext(UiStateContext);
  const [isHovering, setIsHovering] = useState(false);
  const hasChildren = block.childrenIds.length > 0;

  useEffect(() => {
    if (blockRef.current?.material && !blockMaterial) {
      materialCache.set(blockMaterialId, blockRef.current.material);
    }
  }, [blockRef]);

  useEffect(() => {
    if (edgesRef.current?.material && !edgesMaterial) {
      materialCache.set(edgesMaterialId, edgesRef.current.material);
    }
  }, [edgesRef]);

  const handleBlockClick = useCallback(() => {
    dispatch({
      type: hasChildren ? BlockActionType.FORK : BlockActionType.MINE,
      targetBlockId: id,
      chain: chain.name,
    });
    if (Object.keys(state.present[chain.name].blocks).length > 1) {
      automaticScrollToBlock(state.present.stacks.blocks[id], chain.name);
    }
  }, [dispatch, hasChildren]);

  useEffect(() => {
    document.body.style.cursor = getCursor(isHovering, block);
  }, [isHovering, block]);
  const setHover = (hover: boolean) => {
    dispatch({
      type: BlockActionType.HOVER,
      targetBlockId: id,
      chain: chain.name,
      value: hover,
    });
    setIsHovering(hover);
  };

  const handleCubeMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const handleCubeMouseLeave = useCallback(() => {
    setHover(false);
  }, []);
  const springScale = useSpring({
    scale: isHovering ? 1.2 : 1,
    config: { ...config.gentle, trail: 500 },
  });
  const outerCubeSpring = useSpring({
    rotation: isHovering
      ? [0, Math.PI, 0]
      : ([0, 0, 0] as [number, number, number]),
  });
  const [anchorX, anchorY, anchorZ] = getAnchorsFromPosition(
    block.position,
    width,
    height,
    block.type,
    zoom
  );
  const connections = useMemo(
    () => getConnections(block, chain),
    [block, chain]
  );

  return (
    <AnimatedGroup
      position={[anchorX, anchorY, anchorZ]}
      onClick={handleBlockClick}
    >
      <AnimatedBox
        args={[cubeSize, cubeSize, cubeSize]}
        geometry={boxGeometry}
        ref={blockRef}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
        // @FIXME: fix this type casting
        rotation={
          outerCubeSpring.rotation as unknown as [
            x: number,
            y: number,
            z: number
          ]
        }
        scale={springScale.scale}
        onPointerOver={handleCubeMouseEnter}
        onPointerOut={handleCubeMouseLeave}
      >
        <meshStandardMaterial color={getBlockColor(block)} />
        <AnimatedEdges
          scale={springScale.scale}
          visible={isHovering}
          color="white"
        />
      </AnimatedBox>
      {isHovering && (
        <Billboard position={[cubeSize * 2, cubeSize * 2, 1]}>
          <Html>
            <Info block={block} id={id} />
          </Html>
        </Billboard>
      )}
      <Connections
        isHighlighted={block.isHighlighted}
        connections={connections}
      />
    </AnimatedGroup>
  );
};
