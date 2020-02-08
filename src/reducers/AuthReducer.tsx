import UserAuthAction, { LOGIN, LOGOUT, CREATE } from '../actions/types';

const defaultAuthState = {
    isLoggedIn: false,
    isError: false,
    email: '',
    errorString: ''
}

const AuthReducer = (state = defaultAuthState, action: UserAuthAction) => {
    switch (action.type) {
        case CREATE:
            return {
                ...state
            }; 
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                email: action.payload.email
            }
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                email: ''
            }
        default:
            return {
                ...state
            }
    }
}

export default AuthReducer;