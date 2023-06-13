import React, { FC, useEffect, useRef } from "react";
import { Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { BlockRender } from "./components/BlockRender";
import { Group } from "three";

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX | Chain.BTC>;
  translateY?: number;
}> = ({ chain, translateY }) => {
  const groupRef = useRef<Group>(null!);
  const { blocks } = chain;
  useEffect(() => {
    if (groupRef.current && translateY !== undefined) {
      groupRef.current.translateY(translateY);
    }
  }, [translateY]);
  return (
    <group ref={groupRef}>
      {Object.keys(blocks).map((id) => (
        <BlockRender key={id} block={blocks[id]} id={id} chain={chain} />
      ))}
    </group>
  );
};
