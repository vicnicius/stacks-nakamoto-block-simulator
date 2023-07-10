// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore - @TODO: add json-url declaration file */
import JsonParser from "json-url";
import {
  TimeAwareUiState,
  initialBitcoinChain,
  initialStacksChain,
} from "../UiState";

const parserCodec = "lzma";

export const defaultInitialState = {
  past: [],
  present: {
    bitcoin: initialBitcoinChain,
    stacks: initialStacksChain,
    longestChainStartId: "1",
    actions: [],
    lastId: 1,
  },
  future: [],
};

async function digestUrlState(): Promise<TimeAwareUiState> {
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get("state");
  if (!stateParam) {
    throw new Error("State not found in URL");
  }
  const parser = new JsonParser(parserCodec);
  // eslint-disable-next-line no-console
  console.log("Parsing state");
  const parsedState = JSON.parse(
    await parser.decompress(decodeURIComponent(stateParam))
  );
  // eslint-disable-next-line no-console
  console.log("Parsed state", parsedState);
  window.history.replaceState({}, "", window.location.pathname);
  return parsedState;
}

export async function buildShareableState(
  state: TimeAwareUiState
): Promise<{ exportableJson: string; shareUrl: string }> {
  const stringifiedJson = JSON.stringify(state);
  const parser = new JsonParser(parserCodec);

  const shareUrl = `${window.location.origin}/?state=${encodeURIComponent(
    await parser.compress(stringifiedJson)
  )}`;
  return {
    exportableJson: JSON.stringify(state),
    shareUrl,
  };
}

export async function getInitialState(): Promise<TimeAwareUiState> {
  const hasEmbeddedState = window.location.search.includes("state=");

  return hasEmbeddedState ? await digestUrlState() : defaultInitialState;
}
