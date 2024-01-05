// LoginContext.jsx
import { createContext } from "react";

export const LoginContext = createContext({
  isloggedIn: false,
  setLoggedIn: () => {} 
});
