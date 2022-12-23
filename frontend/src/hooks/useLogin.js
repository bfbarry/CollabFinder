import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (username, password) => {

    setIsLoading(true)
    setError(null)
    const res = await fetch('/api/tokens', {
      method: 'POST',
      headers: new Headers({'Authorization': `Basic ${btoa(username+password)}`}),
    })
    const json = await res.json()

    if (!res.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (res.ok) {
      localStorage.setItem('collabsource_user', JSON.stringify(json))
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
    }
  }
  return { login, isLoading, error}
}