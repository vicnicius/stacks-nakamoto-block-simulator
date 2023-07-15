import { animated, config, useSpring } from "@react-spring/three";
import { Box, Edges, MeshTransmissionMaterial } from "@react-three/drei";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BoxGeometry } from "three";
import { UiStateContext } from "../../../../UiState";
import { Block, Chain, StacksBlockState } from "../../../../domain/Block";
import { BlockActionType } from "../../../../domain/BlockAction";
import { Blockchain } from "../../../../domain/Blockchain";
import { DimensionsContext, cubeSize } from "../../../../domain/Dimensions";
import { colors } from "../helpers";
import { Connections } from "./BlockConnections";
import { BlockLabel } from "./BlockLabel";
import { BlockPopup } from "./BlockPopup";
import {
  getAnchorsFromPosition,
  getBlockColor,
  getConnections,
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
      block.state === StacksBlockState.BLESSED)
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
  const { height, width, zoom } = useContext(DimensionsContext);
  const { dispatch } = useContext(UiStateContext);
  const [isHovering, setIsHovering] = useState(false);
  const hasChildren = block.childrenIds.length > 0;

  const handleBlockClick = useCallback(() => {
    dispatch({
      type: hasChildren ? BlockActionType.FORK : BlockActionType.MINE,
      targetBlockId: id,
      chain: chain.name,
    });
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
  const handlePopupMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const handlePopupMouseLeave = useCallback(() => {
    setHover(false);
  }, []);
  const springScale = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: config.gentle,
  });
  const outerCubeSpring = useSpring({
    rotation: isHovering
      ? [0, Math.PI, 0]
      : ([0, 0, 0] as [number, number, number]),
  });
  const edgesSpring = useSpring({
    scale: isHovering || block.isHighlighted ? 1.25 : 1,
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
  const showPopup =
    isHovering &&
    block.type === Chain.STX &&
    block.state === StacksBlockState.NEW;
  return (
    <AnimatedGroup
      position={[anchorX, anchorY, anchorZ]}
      onClick={handleBlockClick}
    >
      <BlockLabel isHovering={isHovering} cubeSize={cubeSize} id={id} />
      <AnimatedBox
        args={[cubeSize, cubeSize, cubeSize]}
        geometry={boxGeometry}
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
        <MeshTransmissionMaterial
          color={getBlockColor(block)}
          transmission={0.25}
          metalness={0.1}
          reflectivity={0.35}
          roughness={0.15}
          distortionScale={1}
          temporalDistortion={0.5}
          clearcoat={1}
          transmissionSampler
        />
        <AnimatedEdges color={colors.white} scale={edgesSpring.scale} />
      </AnimatedBox>
      <group position={[18, 0, -18]}>
        <BlockPopup
          blockId={id}
          chain={block.type}
          hasChildren={hasChildren}
          handleMouseEnter={handlePopupMouseEnter}
          handleMouseLeave={handlePopupMouseLeave}
          position={[anchorX, anchorY, anchorZ]}
          visible={showPopup}
        />
      </group>
      <Connections
        isHighlighted={block.isHighlighted}
        connections={connections}
      />
    </AnimatedGroup>
  );
};
