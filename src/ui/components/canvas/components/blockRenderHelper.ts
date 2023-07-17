import { Material } from "three";
import {
  Block,
  BlockPosition,
  Chain,
  StacksBlockState,
} from "../../../../domain/Block";
import { BlockConnection } from "../../../../domain/BlockConnection";
import { Blockchain } from "../../../../domain/Blockchain";
import { blockSpace, cubeSize } from "../../../../domain/Dimensions";
import { colors } from "../helpers";

function getIsometricCoordinates(
  horizontalDistance: number,
  verticalDistance: number,
  zoom: number
): [x: number, y: number, z: number] {
  const x = horizontalDistance * Math.sqrt(2);
  const y = verticalDistance;
  const z = -horizontalDistance * Math.sqrt(2);
  return [x / zoom, y, z / zoom];
}

const cubeHorizontalDistance = blockSpace;
const cubeVerticalDistance = blockSpace;

export function getAnchorsFromPosition(
  position: BlockPosition,
  spaceWidth: number,
  spaceHeight: number,
  chain: Chain,
  zoom: number
): [number, number, number] {
  const { vertical: positionY, horizontal: positionX } = position;
  const initialY = (spaceHeight / 2) * Math.SQRT2 - cubeSize * 2;
  const initialX = -spaceWidth / 8;
  const cubeX =
    (chain === Chain.STX ? initialX : -initialX) +
    (cubeHorizontalDistance * positionX) / 2;
  const cubeY = initialY - cubeVerticalDistance * (positionY + 1);
  return getIsometricCoordinates(cubeX, cubeY, zoom);
}

export function getBlockColor(block: Block): string {
  if (block.type === Chain.STX && block.state === StacksBlockState.NEW) {
    return colors.darkPurple;
  }

  if (block.type === Chain.STX && block.state === StacksBlockState.FROZEN) {
    return colors.lightBlue;
  }

  if (block.type === Chain.STX && block.state === StacksBlockState.FINALIZED) {
    return colors.silver;
  }

  return colors.darkYellow;
}

export function getConnections(
  block: Block,
  chain: Blockchain<Chain.BTC | Chain.STX>
): BlockConnection[] {
  const parent = block.parentId ? chain.blocks[block.parentId] : undefined;
  if (parent === undefined) {
    return [];
  }
  const connections = [BlockConnection.TOP];
  if (parent.position.horizontal < block.position.horizontal) {
    for (
      let i = block.position.horizontal;
      i > parent.position.horizontal;
      i = i - 1
    ) {
      connections.push(BlockConnection.LEFT);
    }
  }
  if (parent.position.horizontal > block.position.horizontal) {
    for (
      let i = block.position.horizontal;
      i < parent.position.horizontal;
      i = i + 1
    ) {
      connections.push(BlockConnection.RIGHT);
    }
  }
  connections.push(BlockConnection.TOP);
  return connections;
}

export const materialCache = new Map<string, Material | Material[]>();
