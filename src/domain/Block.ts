export enum Chain {
  BTC = "bitcoin",
  STX = "stacks",
}

// A block position in the 3D blockchain is made of its vertical position
// and the horizontal position. The genesis block is in position { vertical: 0, horizontal: 0};
// the next block is in position { vertical: 1, horizontal: 0}, and if it was forked, the next block in the fork would be { vertical: 1, horizontal: 1 }.
// The Horizontal value can be negative, meaning blocks to the left of the genesis block.
// An schematic view of block positions would be:
//        0,0
// 1,-1   1,0   1,1
export type BlockPosition = { vertical: number; horizontal: number };

interface CommonBlock<T extends Chain> {
  type: T;
  isHighlighted: boolean;
  position: BlockPosition;
  parentId?: string;
  childrenIds: string[];
}

export enum StacksBlockState {
  THAWED = "Thawed",
  THAWED_CHILDREN = "ThawedChildren",
  NEW = "New",
  FROZEN = "Frozen",
  FINALIZED = "Finalized",
}

export interface StacksBlock extends CommonBlock<Chain.STX> {
  state: StacksBlockState;
  // The id of the block it was mined in.
  bitcoinBlockId: string;
  confirmations: number;
}

export interface BitcoinBlock extends CommonBlock<Chain.BTC> {
  confirmations: number;
  state: "Final";
}

export type Block = StacksBlock | BitcoinBlock;

export function isStacksBlock(block: Block): block is StacksBlock {
  return block.type === Chain.STX;
}
