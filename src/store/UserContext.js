import {createContext, useState} from 'react'

const UserContext = createContext();

export function UserContextProvider(props) {
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);

  function logOut() {
    setId(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
  }
  const context = {
    id: sessionStorage.getItem("user_id"),
    token: sessionStorage.getItem("token"),
    setId: () => setId(),
    setToken: () => setToken(),
    logOut: logOut
  }

  return (

    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
  
}

export default UserContext