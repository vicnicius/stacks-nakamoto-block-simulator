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
  BLESSED = "blessed",
  NEW = "new",
  FROZEN = "frozen",
  FINALIZED = "finalized",
}

export interface StacksBlock extends CommonBlock<Chain.STX> {
  state: StacksBlockState;
}

export type BitcoinBlock = CommonBlock<Chain.BTC>;

export type Block = StacksBlock | BitcoinBlock;
