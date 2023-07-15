import { Line } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { BlockConnection } from "../../../../domain/BlockConnection";
import {
  DimensionsContext,
  blockSpace,
  cubeSize,
} from "../../../../domain/Dimensions";
import { colors } from "../helpers";

const cubeHorizontalDistance = blockSpace;

export const Connections: FC<{
  connections: BlockConnection[];
  isHighlighted: boolean;
}> = ({ connections, isHighlighted }) => {
  const { zoom } = useContext(DimensionsContext);
  const deltaY = cubeSize * Math.SQRT2;
  const points: [number, number, number][] = [];
  connections.forEach((connection: BlockConnection, index: number) => {
    const deltaX = (cubeHorizontalDistance * Math.SQRT2) / zoom;
    // If it's right behind the parent, we just draw a straight line
    if (connection === BlockConnection.TOP && connections.length === 2) {
      return points.push([0, 0, 0], [0, deltaY * 2, 0]);
    }
    if (connection === BlockConnection.TOP && index === 0) {
      return points.push([0, 0, 0], [0, deltaY, 0]);
    }

    // Final connection
    if (
      connection === BlockConnection.TOP &&
      index === connections.length - 1
    ) {
      const initial: [number, number, number] =
        connections[index - 1] === BlockConnection.LEFT
          ? [
              (-deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2,
              (deltaX * (index - 1)) / 2,
            ]
          : [
              (deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2,
              (-deltaX * (index - 1)) / 2,
            ];
      const final: [number, number, number] =
        connections[index - 1] === BlockConnection.LEFT
          ? [
              (-deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2 * 2,
              (deltaX * (index - 1)) / 2,
            ]
          : [
              (deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2 * 2,
              (-deltaX * (index - 1)) / 2,
            ];
      return points.push(initial, final);
    }
    if (connection === BlockConnection.LEFT) {
      return points.push(
        [
          (-deltaX * (index - 1)) / 2,
          cubeSize * Math.SQRT2,
          (deltaX * (index - 1)) / 2,
        ],
        [(-deltaX * index) / 2, cubeSize * Math.SQRT2, (deltaX * index) / 2]
      );
    }
    if (connections.includes(BlockConnection.RIGHT)) {
      return points.push(
        [
          (deltaX * (index - 1)) / 2,
          cubeSize * Math.SQRT2,
          (-deltaX * (index - 1)) / 2,
        ],
        [(deltaX * index) / 2, cubeSize * Math.SQRT2, (-deltaX * index) / 2]
      );
    }
  });
  const lineWidth = isHighlighted ? 1.5 : 0.25;
  const color = isHighlighted ? colors.white : colors.gray;
  return <Line points={points} segments color={color} lineWidth={lineWidth} />;
};
