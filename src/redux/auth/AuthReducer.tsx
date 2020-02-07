
import { Action } from '../Action';
import { LOGIN, LOGOUT, ERROR } from './AuthActions';

const defaultAuthState = {
    isLoggedIn: false,
    isError: false,
    errorString: ''
}

const AuthReducer = (state: object = defaultAuthState, action: Action) => {
    switch(action.type) {
        case LOGIN:
            return '';
        case LOGOUT:
            return '';
        case ERROR:
            return '';
    }
}

export default AuthReducer;