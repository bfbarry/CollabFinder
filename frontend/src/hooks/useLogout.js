import { useAuthContext } from "./useAuthContext";

// TODO, should this revoke token in backend?
export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const logout = () => {
    localStorage.removeItem('collabsource_user')
    dispatch({type: 'LOGOUT'})
  }
  return { logout }
}

