import { BitcoinBlock, Chain, StacksBlock } from "./Block";
import { BlockAction } from "./BlockAction";

export interface Blockchain<T extends Chain> {
  name: Chain;
  blocks: {
    [id: string]: T extends Chain.STX ? StacksBlock : BitcoinBlock;
  };
  actions: T extends Chain.STX ? BlockAction[] : [];
}
