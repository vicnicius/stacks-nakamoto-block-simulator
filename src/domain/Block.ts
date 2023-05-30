export enum Chain {
  BTC,
  STX,
}

interface CommonBlock<T extends Chain> {
  id: string;
  height: number;
  type: T;
}

export enum StacksBlockState {
  NEW,
  FROZEN,
  BLESSED,
}

export interface StacksBlock extends CommonBlock<Chain.STX> {
  state: StacksBlockState;
}

export type BitcoinBlock = CommonBlock<Chain.BTC>;

export type Block = StacksBlock | BitcoinBlock;
