import { createContext } from "react";

export const DebugContext = createContext<{ debug: boolean }>({
  debug: false,
});
