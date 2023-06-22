import React, { Dispatch } from "react";
import { BlockPosition, Chain, StacksBlockState } from "./domain/Block";
import { BlockAction, BlockActionType } from "./domain/BlockAction";
import { Blockchain } from "./domain/Blockchain";

export interface UiState {
  [Chain.BTC]: Blockchain<Chain.BTC>;
  [Chain.STX]: Blockchain<Chain.STX>;
  actions: BlockAction[];
  lastId: number;
}

function getNewPosition(
  targetBlockId: string,
  blocks: Blockchain<Chain.STX | Chain.BTC>["blocks"]
): BlockPosition {
  const filledPositions: {
    [vertical: number]: {
      [horizontal: number]: boolean;
    };
  } = {};
  Object.values(blocks).forEach((block) => {
    if (filledPositions[block.position.vertical] === undefined) {
      filledPositions[block.position.vertical] = {
        [block.position.horizontal]: true,
      };
    } else {
      filledPositions[block.position.vertical][block.position.horizontal] =
        true;
    }
  });

  const verticalPosition = blocks[targetBlockId].position.vertical + 1;
  const horizontalPosition = blocks[targetBlockId].position.horizontal;
  let availableHorizontalPosition;
  for (let i = 0; i <= 5; i = i + 1) {
    const tryHorizontalPosition = horizontalPosition + i;
    if (
      filledPositions[verticalPosition]?.[tryHorizontalPosition] === undefined
    ) {
      availableHorizontalPosition = tryHorizontalPosition;
      break;
    }
    if (
      filledPositions[verticalPosition]?.[-tryHorizontalPosition] === undefined
    ) {
      availableHorizontalPosition = -tryHorizontalPosition;
      break;
    }
  }
  if (availableHorizontalPosition === undefined) {
    throw new Error("Maximum number of blocks reached");
  }
  return {
    vertical: verticalPosition,
    horizontal: availableHorizontalPosition,
  };
}

function mineBlock(
  targetBlockId: string,
  newBlockId: number,
  targetChain: Chain,
  state: UiState
): { bitcoin: Blockchain<Chain.BTC>; stacks: Blockchain<Chain.STX> } {
  if (targetChain === Chain.STX) {
    const newStacksBlockAttributes = {
      type: targetChain,
      parentId: targetBlockId,
      position: getNewPosition(targetBlockId, state[targetChain].blocks),
      state: StacksBlockState.NEW,
    };
    const newBitcoinBlockAttributes = {
      type: Chain.BTC,
      parentId: targetBlockId,
      position: getNewPosition(
        // When mining stacks we don't want to fork the bitcoin side, so the target is always the tip of the chain
        String(newBlockId - 1),
        state[Chain.BTC].blocks
      ),
    };
    return {
      bitcoin: {
        ...state.bitcoin,
        blocks: {
          ...state.bitcoin.blocks,
          [newBlockId]: newBitcoinBlockAttributes,
        },
      },
      stacks: {
        ...state.stacks,
        blocks: {
          ...state.stacks.blocks,
          [newBlockId]: newStacksBlockAttributes,
        },
      },
    };
  }

  if (targetChain === Chain.BTC) {
    return { stacks: state.stacks, bitcoin: state.bitcoin };
  }

  return { stacks: state.stacks, bitcoin: state.bitcoin };
}

export function reducer(state: UiState, action: BlockAction): UiState {
  // eslint-disable-next-line no-console
  const { chain, type, targetBlockId } = action;
  if (type === BlockActionType.MINE && chain === Chain.STX) {
    const nextId = state.lastId + 1;
    const { bitcoin, stacks } = mineBlock(targetBlockId, nextId, chain, state);
    return {
      stacks,
      bitcoin,
      actions: [...state.actions, action],
      lastId: nextId,
    };
  }

  return {
    ...state,
  };
}

// The Blockchain interface describes the data structure that we will use to render the blocks.
// Each block can have a number of children blocks, and each block has it's own state.
export const initialStacksChain: Blockchain<Chain.STX> = {
  name: Chain.STX,
  actions: [],
  blocks: {
    1: {
      position: { vertical: 0, horizontal: 0 },
      type: Chain.STX,
      state: StacksBlockState.NEW,
    },
  },
};

export const initialBitcoinChain: Blockchain<Chain.BTC> = {
  name: Chain.BTC,
  actions: [],
  blocks: {
    1: {
      position: { vertical: 0, horizontal: 0 },
      type: Chain.BTC,
    },
  },
};

export const UiStateContext = React.createContext<{
  state: UiState;
  dispatch: Dispatch<BlockAction>;
}>({
  state: {
    bitcoin: initialBitcoinChain,
    stacks: initialStacksChain,
    actions: [],
    lastId: 1,
  },
  dispatch: () => undefined,
});
