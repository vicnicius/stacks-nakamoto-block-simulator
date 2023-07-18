import React, { FC, useContext } from "react";
import { DebugContext } from "../../../../domain/Debug";
import { SceneContext } from "../../../../domain/SceneContext";

export const AxesHelper: FC = () => {
  const { debug } = useContext(DebugContext);
  const { height } = useContext(SceneContext);
  if (debug) return <axesHelper args={[height / 2]} />;
  return null;
};
