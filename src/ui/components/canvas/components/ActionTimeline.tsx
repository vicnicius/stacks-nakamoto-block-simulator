import { Html } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { UiStateContext } from "../../../../UiState";
import { BlockActionType } from "../../../../domain/BlockAction";
import { DimensionsContext } from "../../../../domain/Dimensions";
import { ReactComponent as MineIcon } from "../../icons/mine.svg";
import "./ActionTimeline.css";

const Icon = ({
  type,
}: {
  type: Omit<BlockActionType, BlockActionType.HOVER>;
}) => {
  if (type === BlockActionType.MINE) {
    return <MineIcon className="ActionTimelineIcon" />;
  }
  return null;
};

export const ActionTimeline: FC = () => {
  const { height } = useContext(DimensionsContext);
  const {
    state: { actions },
  } = useContext(UiStateContext);

  return (
    <Html position={[0, height / 2, 0]}>
      <ul className="ActionTimelineWrapper" style={{ maxHeight: height - 36 }}>
        {actions.map((action, index) => (
          <li key={index} className="ActionTimeline" style={{ color: "white" }}>
            <Icon type={action.type} />
            {action.type}
          </li>
        ))}
      </ul>
    </Html>
  );
};
