import { Chain } from "./Block";

export enum BlockActionType {
  // When mine targets a block, this means mine a new block having that one as parent.
  MINE = "mine",
  FORK = "fork",
  THAW = "thaw",
  HOVER = "hover",
}

interface CommonBlockAction {
  type: Omit<BlockActionType, BlockActionType.HOVER>;
  targetBlockId?: string;
  chain: Chain;
}

interface HoverAction {
  type: BlockActionType.HOVER;
  targetBlockId: string;
  chain: Chain;
  value: boolean;
}

export function isHoverAction(action: BlockAction): action is HoverAction {
  return action.type === BlockActionType.HOVER;
}

export type BlockAction = CommonBlockAction | HoverAction;
