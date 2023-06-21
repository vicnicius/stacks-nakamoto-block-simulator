import { Chain } from "./Block";

export enum BlockActionType {
  // When mine targets a block, this means mine a new block having that one as parent.
  MINE,
  FREEZE,
  BLESS,
}

export interface BlockAction {
  type: BlockActionType;
  targetBlockId: string;
  chain: Chain;
}
