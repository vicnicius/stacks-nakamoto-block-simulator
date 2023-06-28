import { Dispatch, createContext } from "react";
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
import { TimeAction, TimeActionType, isTimeAction } from "./domain/TimeAction";

const FINALIZED_BLOCKS_DEPTH = 100;
const FROZEN_BLOCKS_DEPTH = 6;

export interface TimeAwareUiState {
  past: UiState[];
  present: UiState;
  future: UiState[];
}

export interface UiState {
  [Chain.BTC]: Blockchain<Chain.BTC>;
  [Chain.STX]: Blockchain<Chain.STX>;
  actions: BlockAction[];
  lastId: number;
  longestChainStartId: string;
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

function getLengthFromId<T extends Chain>(
  chain: Blockchain<T>,
  startId: string
): number {
  let block = chain.blocks[startId];
  let length = 1;
  while (block.parentId !== undefined) {
    block = chain.blocks[block.parentId];
    length = length + 1;
  }
  return length;
}

function getLongestChainStartId<T extends Chain>(chain: Blockchain<T>): string {
  const [longestBlockId] = Object.keys(chain.blocks)
    .map((blockId) => [blockId, getLengthFromId(chain, blockId)])
    .reduce(
      (acc, [blockId, length]) => {
        if (length > acc[1]) {
          return [blockId, length];
        }
        return acc;
      },
      ["", 0]
    );
  return String(longestBlockId);
}

function freezeChildren(chain: Blockchain<Chain.STX>, id: string) {
  chain.blocks[id].state = StacksBlockState.FROZEN;
  chain.blocks[id].childrenIds.forEach((childId) => {
    freezeChildren(chain, childId);
  });
}

function applyRules(
  chain: Blockchain<Chain.STX>,
  startId: string
): Blockchain<Chain.STX> {
  let depth = 1;
  let previousId: undefined | string = undefined;
  let currentId = startId;
  let currentBlock = chain.blocks[startId];
  while (currentBlock.parentId !== undefined) {
    if (
      depth > FROZEN_BLOCKS_DEPTH &&
      depth <= FINALIZED_BLOCKS_DEPTH &&
      currentBlock.state !== StacksBlockState.BLESSED
    ) {
      chain.blocks[currentId].state = StacksBlockState.FROZEN;
      chain.blocks[currentId].childrenIds.forEach((childId) => {
        if (previousId !== undefined && childId !== previousId) {
          freezeChildren(chain, childId);
        }
      });
    }

    if (depth > FINALIZED_BLOCKS_DEPTH) {
      chain.blocks[currentId].state = StacksBlockState.FINALIZED;
    }
    depth = depth + 1;
    previousId = currentId;
    currentId = currentBlock.parentId;
    currentBlock = chain.blocks[currentBlock.parentId];
  }
  if (
    currentBlock.parentId === undefined &&
    depth > FROZEN_BLOCKS_DEPTH &&
    depth <= FINALIZED_BLOCKS_DEPTH
  ) {
    chain.blocks[currentId].state = StacksBlockState.FROZEN;
  }
  if (currentBlock.parentId === undefined && depth > FINALIZED_BLOCKS_DEPTH) {
    chain.blocks[currentId].state = StacksBlockState.FINALIZED;
  }
  return { ...chain };
}

function reducer(state: UiState, action: BlockAction): UiState {
  const { chain, type, targetBlockId } = action;

  // Mining Stacks blocks
  if (
    (type === BlockActionType.MINE || type === BlockActionType.FORK) &&
    chain === Chain.STX
  ) {
    const blockId = targetBlockId ?? state.longestChainStartId;
    // @TODO: Refactor nested ifs
    if (
      state.stacks.blocks[blockId].state !== StacksBlockState.NEW &&
      state.stacks.blocks[blockId].state !== StacksBlockState.BLESSED
    ) {
      throw new Error("Trying to mine unmineable block");
    }

    const nextId = state.lastId + 1;
    const { bitcoin, stacks: updatedStacksChain } = mineBlock(
      blockId,
      nextId,
      chain,
      state
    );
    const longestChainStartId = getLongestChainStartId(updatedStacksChain);
    const stacks = applyRules(updatedStacksChain, longestChainStartId);

    return {
      stacks,
      bitcoin,
      actions: [
        ...state.actions,
        {
          ...action,
          targetBlockId: targetBlockId ?? state.longestChainStartId,
        },
      ],
      longestChainStartId: getLongestChainStartId(stacks),
      lastId: nextId,
    };
  }

  if (isHoverAction(action) && chain === Chain.STX) {
    const blockId = targetBlockId ?? state.longestChainStartId;
    // @TODO: Refactor nested ifs
    if (!blockId) {
      throw new Error("Trying to hover invalid block");
    }
    const stacks = highlighBlock(
      blockId,
      state.stacks,
      action.value as boolean
    );
    return {
      ...state,
      stacks,
    };
  }

  if (isHoverAction(action) && chain === Chain.BTC) {
    const blockId = targetBlockId ?? state.longestChainStartId;
    // @TODO: Refactor nested ifs
    if (!blockId) {
      throw new Error("Trying to hover invalid block");
    }
    const bitcoin = highlighBlock(
      blockId,
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

export function timeAwareReducer(
  state: TimeAwareUiState,
  action: BlockAction | TimeAction
): TimeAwareUiState {
  const { past, present, future } = state;
  if (!isTimeAction(action)) {
    const newPresent = reducer(present, action);
    // We don't want to store hover actions
    const newPast = isHoverAction(action) ? past : [...past, present];
    return {
      past: newPast,
      present: newPresent,
      future,
    };
  }
  if (action.type === TimeActionType.UNDO) {
    const previous = past[past.length - 1];
    return {
      past: past.slice(0, past.length - 1),
      present: previous,
      future: [present, ...future],
    };
  }
  if (action.type === TimeActionType.REDO && future.length > 0) {
    const next = future[0];
    return {
      past: [...past, present],
      present: next,
      future: future.slice(1),
    };
  }
  // eslint-disable-next-line no-console
  console.warn("Reducer was called by no action was matched.", {
    state,
    action,
  });
  return {
    past,
    present,
    future,
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

export const UiStateContext = createContext<{
  state: TimeAwareUiState;
  dispatch: Dispatch<BlockAction | TimeAction>;
}>({
  state: {
    past: [],
    present: {
      bitcoin: initialBitcoinChain,
      stacks: initialStacksChain,
      actions: [],
      lastId: 1,
      longestChainStartId: "1",
    },
    future: [],
  },
  dispatch: () => undefined,
});
