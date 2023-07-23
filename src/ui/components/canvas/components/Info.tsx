import React, { FC } from "react";
import { Block, StacksBlockState } from "../../../../domain/Block";
import "./Info.css";

function getInfoForBlockState(state: string): React.ReactNode {
  if (state === StacksBlockState.NEW) {
    return "This block is in its unconfirmed phase. It does not yet have 6 Stacks confirmations. It can be the parent of a new block.";
  }

  if (state === StacksBlockState.FROZEN) {
    return "It either has at least 6 Stacks confirmations or it does not descend from the highest frozen block, and the Bitcoin block it is mined in does not yet have 100 Bitcoin confirmations.";
  }

  return null;
}

export const Info: FC<{ block: Block; id: string }> = ({ block, id }) => {
  const info = getInfoForBlockState(block.state);
  return (
    <div className="InfoWrapper">
      <div className="InfoGroup">
        <p className="InfoLine">ID:</p>
        <p className="InfoDescription">#{id}</p>
      </div>
      <div className="InfoGroup">
        <p className="InfoLine">State:</p>
        <p className="InfoDescription">{block.state}</p>
      </div>
      {info && (
        <div className="InfoGroup">
          <p className="InfoLine">Info:</p>
          <p className="InfoDescription">{info}</p>
        </div>
      )}
    </div>
  );
};
