import React, { Dispatch } from "react";
import {
  BitcoinBlock,
  BlockPosition,
  Chain,
  StacksBlock,
  StacksBlockState,
} from "./domain/Block";
import {
  BlockAction,
  BlockActionType,
  isHoverAction,
} from "./domain/BlockAction";
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
    const tryHorizontalPositionNegative = horizontalPosition - i;
    if (
      filledPositions[verticalPosition]?.[tryHorizontalPosition] === undefined
    ) {
      availableHorizontalPosition = tryHorizontalPosition;
      break;
    }
    if (
      filledPositions[verticalPosition]?.[tryHorizontalPositionNegative] ===
      undefined
    ) {
      availableHorizontalPosition = tryHorizontalPositionNegative;
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
    const newStacksBlockAttributes: StacksBlock = {
      type: targetChain,
      childrenIds: [],
      isHighlighted: false,
      parentId: targetBlockId,
      position: getNewPosition(targetBlockId, state[targetChain].blocks),
      state: StacksBlockState.NEW,
    };
    const updatedStacksParentBlock: StacksBlock = {
      ...state[targetChain].blocks[targetBlockId],
      childrenIds: [
        ...state[targetChain].blocks[targetBlockId].childrenIds,
        String(newBlockId),
      ],
    };

    // When mining stacks we don't want to fork the bitcoin side, so the target is always the tip of the chain
    const bitcoinParentId = String(newBlockId - 1);
    const newBitcoinBlockAttributes: BitcoinBlock = {
      type: Chain.BTC,
      childrenIds: [],
      isHighlighted: false,
      parentId: bitcoinParentId,
      position: getNewPosition(
        String(bitcoinParentId),
        state[Chain.BTC].blocks
      ),
    };
    const updatedBitcoinParentBlock: BitcoinBlock = {
      ...state[Chain.BTC].blocks[bitcoinParentId],
      childrenIds: [
        ...state[Chain.BTC].blocks[bitcoinParentId].childrenIds,
        String(newBlockId),
      ],
    };

    return {
      bitcoin: {
        ...state.bitcoin,
        blocks: {
          ...state.bitcoin.blocks,
          [newBlockId]: newBitcoinBlockAttributes,
          [bitcoinParentId]: updatedBitcoinParentBlock,
        },
      },
      stacks: {
        ...state.stacks,
        blocks: {
          ...state.stacks.blocks,
          [targetBlockId]: updatedStacksParentBlock,
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

function highlighBlock<T extends Chain>(
  blockId: string,
  blockchain: Blockchain<T>,
  highlight: boolean
): Blockchain<T> {
  if (!blockchain.blocks[blockId]) {
    throw new Error("Trying to hover inexistent block!");
  }
  const updatedChain = {
    ...blockchain,
    blocks: {
      ...blockchain.blocks,
      [blockId]: { ...blockchain.blocks[blockId], isHighlighted: highlight },
    },
  };
  return blockchain.blocks[blockId].parentId === undefined
    ? updatedChain
    : highlighBlock(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        blockchain.blocks[blockId].parentId!,
        updatedChain,
        highlight
      );
}

export function reducer(state: UiState, action: BlockAction): UiState {
  const { chain, type, targetBlockId } = action;
  if (
    (type === BlockActionType.MINE || type === BlockActionType.FORK) &&
    chain === Chain.STX
  ) {
    const nextId = state.lastId + 1;
    const { bitcoin, stacks } = mineBlock(targetBlockId, nextId, chain, state);
    return {
      stacks,
      bitcoin,
      actions: [...state.actions, action],
      lastId: nextId,
    };
  }

  if (isHoverAction(action) && chain === Chain.STX) {
    const stacks = highlighBlock(
      targetBlockId,
      state.stacks,
      action.value as boolean
    );
    return {
      ...state,
      stacks,
    };
  }

  if (isHoverAction(action) && chain === Chain.BTC) {
    const bitcoin = highlighBlock(
      targetBlockId,
      state.bitcoin,
      action.value as boolean
    );
    return {
      ...state,
      bitcoin,
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
      childrenIds: [],
      isHighlighted: false,
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
      isHighlighted: false,
      type: Chain.BTC,
      childrenIds: [],
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
