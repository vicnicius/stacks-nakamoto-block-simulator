import React, { FC } from "react";
import { Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { BlockRender } from "./components/BlockRender";

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX | Chain.BTC>;
}> = ({ chain }) => {
  const { blocks } = chain;
  return (
    <group>
      {Object.keys(blocks).map((id) => (
        <BlockRender key={id} block={blocks[id]} id={id} chain={chain} />
      ))}
    </group>
  );
};
