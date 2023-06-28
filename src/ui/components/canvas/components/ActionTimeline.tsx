import { Html } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { UiStateContext } from "../../../../UiState";
import { BlockActionType } from "../../../../domain/BlockAction";
import { DimensionsContext } from "../../../../domain/Dimensions";
import "./ActionTimeline.css";
import { Icon } from "../../icon/Icon";

const InlineIcon = ({
  type,
}: {
  type: Omit<BlockActionType, BlockActionType.HOVER>;
}) => {
  if (type === BlockActionType.MINE) {
    return <Icon name="mine" className="ActionTimelineIcon" />;
  }
  if (type === BlockActionType.FORK) {
    return <Icon name="fork" className="ActionTimelineIcon" />;
  }
  return null;
};

export const ActionTimeline: FC = () => {
  const { height } = useContext(DimensionsContext);
  const {
    state: {
      present: { actions },
    },
  } = useContext(UiStateContext);

  return (
    <Html position={[0, height / 2, 0]}>
      <ul className="ActionTimelineWrapper" style={{ maxHeight: height - 36 }}>
        {actions.map((action, index) => (
          <li key={index} className="ActionTimeline">
            <InlineIcon type={action.type} />
            {action.type} #{action.targetBlockId}
          </li>
        ))}
      </ul>
    </Html>
  );
};
