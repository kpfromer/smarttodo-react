import { createContext } from "react";

export const ValidatorContext = createContext({
  initializeInput: () => {},
  removeInput: () => {},
  updateFormInput: () => {}
});