import noop from "lodash/noop";
import { createContext } from "react";
import { Block, Chain } from "../../../../domain/Block";

export const ScrollContext = createContext<{
  automaticScrollToBlock: (block: Block, chain: Chain) => void;
}>({
  automaticScrollToBlock: noop,
});
