import React, { FC } from "react";
import { Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { BlockRender } from "./components/BlockRender";

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX | Chain.BTC>;
}> = ({ chain }) => {
  const { block, children } = chain;
  return (
    <group>
      <BlockRender block={block} />
      {children.map((childrenBlock) => {
        return (
          <BlockchainRender
            key={childrenBlock.block.id}
            chain={childrenBlock}
          />
        );
      })}
    </group>
  );
};
