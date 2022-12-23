import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext()

// initial state
const empty_user = {token:null, user_id:null}

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return {user: empty_user}
    default:
      return state // which is empty user
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {user: empty_user})
  // only runs when this context renders: if user is already in local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('collabsource_user'))
    if (user) {
      dispatch({type: 'LOGIN', payload: user})
    }
  }, [])

  return (
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>
  )
}