import { animated, useSpring } from "@react-spring/web";
import classnames from "classnames";
import { reverse } from "lodash";
import React, { FC, useCallback, useContext, useRef, useState } from "react";
import { UiStateContext } from "../../../UiState";
import { BlockActionType } from "../../../domain/BlockAction";
import { SceneContext } from "../../../domain/SceneContext";
import { TimeActionType } from "../../../domain/TimeAction";
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

export const ActionTimeline: FC<{ visible: boolean; className?: string }> = ({
  className,
  visible,
}) => {
  const css = classnames(className, "ActionTimelineWrapper");
  const [highlightUpTo, setHighlightUpTo] = useState<number>(-1);
  const { dispatch } = useContext(UiStateContext);
  const container = useRef<HTMLDivElement>(null);
  const { height } = useContext(SceneContext);
  const { maxHeight } = useSpring({ maxHeight: visible ? height : 0 });
  const {
    state: {
      present: { actions },
    },
  } = useContext(UiStateContext);
  const handleMouseEnter = useCallback((index: number) => {
    dispatch({
      type: TimeActionType.PREVIEW,
      targetActionIndex: index,
    });
    setHighlightUpTo(index);
  }, []);
  const handleMouseLeave = useCallback(() => {
    dispatch({
      type: TimeActionType.PREVIEW,
      targetActionIndex: undefined,
    });
    setHighlightUpTo(-1);
  }, []);

  return (
    <animated.div className={css} style={{ maxHeight }} ref={container}>
      {actions.length > 0 && (
        <animated.ul className="ActionTimeline" style={{ maxHeight }}>
          {/* We have to reverse the array because of the CSS column-reverse rule,
          used to keep the scroll at the bottom */}
          {reverse(
            [...actions].map((action, index) => (
              <li
                key={index}
                className={classnames("ActionTimelineItem", {
                  "ActionTimelineItem--highlighted": index <= highlightUpTo,
                })}
                onMouseEnter={() => {
                  handleMouseEnter(index);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
              >
                <InlineIcon type={action.type} />
                {action.type} #{action.targetBlockId}
              </li>
            ))
          )}
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
