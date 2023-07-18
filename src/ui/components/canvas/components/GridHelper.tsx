import React, { FC, useContext } from "react";
import { DebugContext } from "../../../../domain/Debug";
import { SceneContext } from "../../../../domain/SceneContext";

export const GridHelper: FC = () => {
  const { debug } = useContext(DebugContext);
  const { width } = useContext(SceneContext);

  if (debug) return <gridHelper args={[width, 100, 1]} />;

  return null;
};
