import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext); // this contains state AND the dispatch function

  //check current context is right context
  if (!context) {
    throw Error('this context must be used in its provider')
  }
  return context
}


