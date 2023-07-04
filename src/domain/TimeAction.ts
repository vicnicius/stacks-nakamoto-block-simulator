export enum TimeActionType {
  UNDO = "undo",
  REDO = "redo",
  PREVIEW = "preview",
}

export interface TimeAction {
  type: TimeActionType;
  targetActionIndex?: number;
}

function checkIfIsObject(
  value: unknown
): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected an object");
  }
}

export function isTimeAction(action: unknown): action is TimeAction {
  checkIfIsObject(action);
  return (
    action.type === TimeActionType.UNDO ||
    action.type === TimeActionType.REDO ||
    action.type === TimeActionType.PREVIEW
  );
}
