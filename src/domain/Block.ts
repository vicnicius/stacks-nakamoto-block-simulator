interface CommonBlock {
  depth: number;
}
interface StacksBlock extends CommonBlock {
  type: "stacks";
  state: "new" | "frozen" | "blessed";
}

interface BitcoinBlock extends CommonBlock {
  type: "bitcoin";
}

export type Block = StacksBlock | BitcoinBlock;
