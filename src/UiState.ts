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
import { ImportAction, isImportAction } from "./domain/ImportAction";
import { TimeAction, TimeActionType, isTimeAction } from "./domain/TimeAction";

const FINALIZED_BLOCKS_DEPTH = 100;
const FROZEN_BLOCKS_DEPTH = 6;

export interface TimeAwareUiState {
  past: UiState[];
  present: UiState;
  future: UiState[];
  preview?: UiState;
}

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
    // When mining stacks we always do it on a new block of the canonical fork
    const bitcoinParentId = state.bitcoin.longestChainStartId;
    let confirmations = 1;
    const newBitcoinBlockAttributes: BitcoinBlock = {
      type: Chain.BTC,
      childrenIds: [],
      isHighlighted: false,
      confirmations,
      parentId: bitcoinParentId,
      position: getNewPosition(
        String(bitcoinParentId),
        state[Chain.BTC].blocks
      ),
      state: "Final",
    };
    const updatedBitcoinParentBlock: BitcoinBlock = {
      ...state[Chain.BTC].blocks[bitcoinParentId],
      childrenIds: [
        ...state[Chain.BTC].blocks[bitcoinParentId].childrenIds,
        String(newBlockId),
      ],
    };
    const newPosition = getNewPosition(
      targetBlockId,
      state[targetChain].blocks
    );
    const newStacksBlockAttributes: StacksBlock = {
      type: targetChain,
      bitcoinBlockId: String(newBlockId),
      childrenIds: [],
      isHighlighted: false,
      parentId: targetBlockId,
      confirmations: confirmations,
      position: newPosition,
      state: StacksBlockState.NEW,
    };
    const updatedStacksParentBlock: StacksBlock = {
      ...state[targetChain].blocks[targetBlockId],
      childrenIds: [
        ...state[targetChain].blocks[targetBlockId].childrenIds,
        String(newBlockId),
      ],
    };

    let parentId = newStacksBlockAttributes.parentId;
    while (parentId !== undefined) {
      confirmations = confirmations + 1;
      state[targetChain].blocks[parentId] = {
        ...state[targetChain].blocks[parentId],
        confirmations: confirmations,
      };
      parentId = state[targetChain].blocks[parentId].parentId;
    }

    let tmpBitcoinParentId = newBitcoinBlockAttributes.parentId;
    let bitcoinConfirmations = 1;
    while (tmpBitcoinParentId !== undefined) {
      bitcoinConfirmations = bitcoinConfirmations + 1;
      state.bitcoin.blocks[tmpBitcoinParentId] = {
        ...state.bitcoin.blocks[tmpBitcoinParentId],
        confirmations: bitcoinConfirmations,
      };
      tmpBitcoinParentId = state.bitcoin.blocks[tmpBitcoinParentId].parentId;
    }

    return {
      bitcoin: {
        ...state.bitcoin,
        blocks: {
          ...state.bitcoin.blocks,
          [bitcoinParentId]: updatedBitcoinParentBlock,
          [newBlockId]: newBitcoinBlockAttributes,
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
    // When mining stacks we always do it on a new block of the canonical fork
    let confirmations = 1;
    const newBitcoinBlockAttributes: BitcoinBlock = {
      type: Chain.BTC,
      childrenIds: [],
      confirmations,
      isHighlighted: false,
      parentId: targetBlockId,
      position: getNewPosition(String(targetBlockId), state[Chain.BTC].blocks),
      state: "Final",
    };
    const updatedBitcoinParentBlock: BitcoinBlock = {
      ...state[Chain.BTC].blocks[targetBlockId],
      childrenIds: [
        ...state[Chain.BTC].blocks[targetBlockId].childrenIds,
        String(newBlockId),
      ],
    };

    let parentId = newBitcoinBlockAttributes.parentId;
    while (parentId !== undefined) {
      confirmations = confirmations + 1;
      state[targetChain].blocks[parentId] = {
        ...state[targetChain].blocks[parentId],
        confirmations: confirmations,
      };
      parentId = state[targetChain].blocks[parentId].parentId;
    }

    return {
      bitcoin: {
        ...state.bitcoin,
        blocks: {
          ...state.bitcoin.blocks,
          [targetBlockId]: updatedBitcoinParentBlock,
          [newBlockId]: newBitcoinBlockAttributes,
        },
      },
      stacks: state.stacks,
    };

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
  startId: string,
  resetHighlight = false
): Blockchain<Chain.STX> {
  let depth = 1;
  let previousId: undefined | string = undefined;
  let currentId = startId;
  let currentBlock = chain.blocks[startId];
  while (currentBlock.parentId !== undefined) {
    if (
      depth > FROZEN_BLOCKS_DEPTH &&
      depth <= FINALIZED_BLOCKS_DEPTH &&
      currentBlock.state !== StacksBlockState.THAWED
    ) {
      chain.blocks[currentId].state = StacksBlockState.FROZEN;
      chain.blocks[currentId].childrenIds.forEach((childId) => {
        if (previousId !== undefined && childId !== previousId) {
          freezeChildren(chain, childId);
        }
      });
    } else if (depth > FINALIZED_BLOCKS_DEPTH) {
      chain.blocks[currentId].state = StacksBlockState.FINALIZED;
    } else if (currentBlock.state !== StacksBlockState.THAWED) {
      chain.blocks[currentId].state = StacksBlockState.NEW;
    }
    depth = depth + 1;
    previousId = currentId;
    currentId = currentBlock.parentId;
    currentBlock = chain.blocks[currentBlock.parentId];
    if (resetHighlight) {
      currentBlock.isHighlighted = false;
    }
  }
  if (
    currentBlock.parentId === undefined &&
    depth > FROZEN_BLOCKS_DEPTH &&
    depth <= FINALIZED_BLOCKS_DEPTH
  ) {
    chain.blocks[currentId].state = StacksBlockState.FROZEN;
  } else if (
    currentBlock.parentId === undefined &&
    depth > FINALIZED_BLOCKS_DEPTH
  ) {
    chain.blocks[currentId].state = StacksBlockState.FINALIZED;
  } else if (
    currentBlock.parentId === undefined &&
    currentBlock.state !== StacksBlockState.THAWED
  ) {
    chain.blocks[currentId].state = StacksBlockState.NEW;
  }
  if (resetHighlight) {
    chain.blocks[currentId].isHighlighted = false;
  }

  return { ...chain };
}

function reducer(state: UiState, action: BlockAction): UiState {
  const { chain, type, targetBlockId } = action;

  // Mining Stacks blocks
  if (type === BlockActionType.MINE || type === BlockActionType.FORK) {
    const blockId = targetBlockId ?? state[chain].longestChainStartId;
    if (
      chain === Chain.STX &&
      state.stacks.blocks[blockId].state !== StacksBlockState.NEW &&
      state.stacks.blocks[blockId].state !== StacksBlockState.THAWED
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
    const longestStacksTipId = getLongestChainStartId(updatedStacksChain);
    const longestBitcoinTipId = getLongestChainStartId(bitcoin);
    const stacks = applyRules(updatedStacksChain, longestStacksTipId);

    return {
      stacks: { ...stacks, longestChainStartId: longestStacksTipId },
      bitcoin: { ...bitcoin, longestChainStartId: longestBitcoinTipId },
      actions: [
        ...state.actions,
        {
          ...action,
          targetBlockId: targetBlockId ?? state[chain].longestChainStartId,
        },
      ],
      lastId: nextId,
    };
  }

  if (isHoverAction(action) && chain === Chain.STX) {
    const blockId = targetBlockId ?? state.stacks.longestChainStartId;
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
    const blockId = targetBlockId ?? state.bitcoin.longestChainStartId;
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
  action: BlockAction | TimeAction | ImportAction<TimeAwareUiState>
): TimeAwareUiState {
  const { past, present, future } = state;
  if (isImportAction<TimeAwareUiState>(action)) {
    return action.importedState;
  }
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
  if (
    action.type === TimeActionType.PREVIEW &&
    action.targetActionIndex === undefined
  ) {
    const stacks = applyRules(
      present.stacks,
      present.stacks.longestChainStartId,
      true
    );
    return {
      ...state,
      present: {
        ...present,
        stacks,
      },
      preview: undefined,
    };
  }
  if (
    action.type === TimeActionType.PREVIEW &&
    action.targetActionIndex !== undefined
  ) {
    const preview = past[action.targetActionIndex + 1] ?? present;
    const stacks = applyRules(
      preview.stacks,
      preview.stacks.longestChainStartId,
      true
    );
    return {
      ...state,
      preview: {
        ...preview,
        stacks,
      },
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
      bitcoinBlockId: "1",
      confirmations: 1,
      position: { vertical: 0, horizontal: 0 },
      childrenIds: [],
      isHighlighted: false,
      type: Chain.STX,
      state: StacksBlockState.NEW,
    },
  },
  longestChainStartId: "1",
};

export const initialBitcoinChain: Blockchain<Chain.BTC> = {
  name: Chain.BTC,
  actions: [],
  blocks: {
    1: {
      position: { vertical: 0, horizontal: 0 },
      confirmations: 1,
      isHighlighted: false,
      type: Chain.BTC,
      state: "Final",
      childrenIds: [],
    },
  },
  longestChainStartId: "1",
};

export const UiStateContext = createContext<{
  state: TimeAwareUiState;
  dispatch: Dispatch<BlockAction | TimeAction | ImportAction<TimeAwareUiState>>;
}>({
  state: {
    past: [],
    present: {
      bitcoin: initialBitcoinChain,
      stacks: initialStacksChain,
      actions: [],
      lastId: 1,
    },
    future: [],
  },
  dispatch: () => undefined,
});
