// Thanks to https://soshace.com/react-user-login-authentication-using-usecontext-and-usereducer/
import {createContext, useContext, useReducer} from 'react'
import { loginUser, logout } from './actions';
export { loginUser, logout }; //awkward way of consolidating exports 

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("context error")
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("context error")
  }
  return context;
}

let user = localStorage.getItem("currentUser") ?
      JSON.parse(localStorage.getItem("currentUser")).user
      : "";

let token = localStorage.getItem("currentUser") ?
      JSON.parse(localStorage.getItem("currentUser")).auth_token
      : "";

const initialState = {
  user_id: "" || user,
  token: "" || token,
  loading: false,
  errorMessage: null
}

export function AuthReducer (initialState, action) {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user_id: action.payload.user,
        token: action.payload.auth_token,
        loading: false
      }; 
    case "LOGOUT":
      return {
        ...initialState,
        user_id: "",
        token: ""
      };
    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error
      };  
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export function AuthProvider({ children }) {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
    <AuthDispatchContext.Provider value={dispatch}>
      {children}
    </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}



// const UserContext = createContext();

// export function UserContextProvider(props) {
//   const [id, setId] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(null);

//   function logOut() {
//     setId(null);
//     setToken(null);
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("user_id");
//   }
//   const context = useMemo(() => ({
//     id: sessionStorage.getItem("user_id"),
//     token: sessionStorage.getItem("token"),
//     setId: setId,
//     setToken: setToken,
//     logOut: logOut,
//     loading: loading,
//     setLoading: setLoading,
//   }), [id])

//   return (

//     <UserContext.Provider value={context}>
//       {props.children}
//     </UserContext.Provider>
//   );
  
// }

// export default UserContext