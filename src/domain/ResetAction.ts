export interface ResetAction {
  type: "reset";
}

export function isResetAction(action: unknown): action is ResetAction {
  return (action as ResetAction).type === "reset";
}
