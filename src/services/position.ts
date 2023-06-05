import { BlockPosition } from "../domain/Block";

interface BlockchainSpaceState {
  [vertical: number]: {
    [horizontal: number]: string;
  };
}

export const createNewBlockchainSpace = (genesisBlockId: string) => {
  const initialState: BlockchainSpaceState = {
    1: {
      1: genesisBlockId,
    },
  };
  const maxHorizontalPosition = 20;
  const state: BlockchainSpaceState = initialState;

  const findFreeHorizonalPosition = (
    verticalPosition: number,
    parentHorizontalPosition: number,
    distance = 0
  ): number => {
    const vertical = state[verticalPosition];
    if (!vertical) {
      throw new Error("Can't place block in non existing vertical position");
    }

    const leftPositionCandidate = parentHorizontalPosition + distance;
    const outOfLeftBound = leftPositionCandidate > maxHorizontalPosition;
    if (
      state[verticalPosition][leftPositionCandidate] === undefined &&
      leftPositionCandidate <= maxHorizontalPosition
    ) {
      return leftPositionCandidate;
    }

    const rightPositionCandidate = parentHorizontalPosition - distance;
    const outOfRightBound = rightPositionCandidate < 1;
    if (
      state[verticalPosition][parentHorizontalPosition - distance] ===
        undefined &&
      rightPositionCandidate >= 1
    ) {
      return rightPositionCandidate;
    }

    if (outOfLeftBound && outOfRightBound) {
      throw new Error("Can't place block in the next vertical position");
    }

    return findFreeHorizonalPosition(
      verticalPosition,
      parentHorizontalPosition,
      distance + 1
    );
  };

  const placeChildrenBlock = (
    blockId: string,
    parentPosition: BlockPosition
  ): BlockPosition => {
    const {
      vertical: parentVerticalPosition,
      horizontal: parentHorizontalPosition,
    } = parentPosition;
    const childrenVerticalPosition = parentVerticalPosition + 1;
    const childrenHorizontalPosition = findFreeHorizonalPosition(
      childrenVerticalPosition,
      parentHorizontalPosition
    );
    state[parentVerticalPosition][parentHorizontalPosition] = blockId;
    return {
      vertical: childrenVerticalPosition,
      horizontal: childrenHorizontalPosition,
    };
  };

  const getState = () => state;
  return {
    getState,
    placeChildrenBlock,
  };
};
