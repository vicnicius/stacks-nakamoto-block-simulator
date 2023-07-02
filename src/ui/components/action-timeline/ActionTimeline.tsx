import { animated, useSpring } from "@react-spring/web";
import { reverse } from "lodash";
import React, { FC, useContext, useRef } from "react";
import { UiStateContext } from "../../../UiState";
import { BlockActionType } from "../../../domain/BlockAction";
import { DimensionsContext } from "../../../domain/Dimensions";
import { Icon } from "../icon/Icon";
import "./ActionTimeline.css";

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

export const ActionTimeline: FC<{ visible: boolean }> = ({ visible }) => {
  const container = useRef<HTMLDivElement>(null);
  const { height } = useContext(DimensionsContext);
  const { maxHeight } = useSpring({ maxHeight: visible ? height : 0 });
  const {
    state: {
      present: { actions },
    },
  } = useContext(UiStateContext);

  return (
    <animated.div
      className={"ActionTimelineWrapper"}
      style={{ maxHeight }}
      ref={container}
    >
      {actions.length > 0 && (
        <animated.ul className="ActionTimeline" style={{ maxHeight }}>
          {/* We have to reverse the array because of the CSS column-reverse rule,
          used to keep the scroll at the bottom */}
          {reverse([...actions]).map((action, index) => (
            <li key={index} className="ActionTimelineItem">
              <InlineIcon type={action.type} />
              {action.type} #{action.targetBlockId}
            </li>
          ))}
        </animated.ul>
      )}
      {actions.length === 0 && (
        <div className="ActionTimelineEmpty">
          <p className="ActionTimelineMessage">No actions to show yet</p>
        </div>
      )}
    </animated.div>
  );
};
