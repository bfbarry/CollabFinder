//keep all async login related functions in one place
const ROOT_URL = 'http://localhost:3000/api'

export async function loginUser(dispatch, loginPayload) {
    const opts = {
        method: 'POST',
        headers: new Headers({
                "Authorization": `Basic ${btoa(loginPayload)}`
        })
    };

    try {
        dispatch({ type: 'REQUEST_LOGIN'});
        let resp = await fetch(ROOT_URL+'/tokens', opts);
        let data = await resp.json();

        if (data.user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: data});
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data
        }

        dispatch({ type: 'LOGIN_ERROR', error: data.errors[0]});
        return;
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error});
    }
}

export async function logout(dispatch) {
    // const history = useHistory();
    dispatch({ type: 'LOGOUT'});
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); //shouldn't need this
    // history.replace('/')

}