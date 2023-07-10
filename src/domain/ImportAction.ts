export interface ImportAction<S> {
  type: "import";
  importedState: S;
}

export function isImportAction<S>(action: unknown): action is ImportAction<S> {
  return (action as ImportAction<S>).type === "import";
}
