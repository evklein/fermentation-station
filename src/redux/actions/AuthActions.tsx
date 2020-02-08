import UserAuthAction, { CREATE, LOGIN, LOGOUT } from '../types/AuthTypes';

export const signUpUser = (email: string, password: string): UserAuthAction => {
    return {
        type: CREATE,
        payload: {
            email: email,
            password: password
        }
    }
}

export const signInUser = (email: string, password: string): UserAuthAction => {
    return {
        type: LOGIN,
        payload: {
            email: email,
            password: password
        }
    }
}

export const signOutUser = (email: string): UserAuthAction => {
    return {
        type: LOGOUT,
        payload: {
            email: email,
            password: '' // Not necessary for this one.
        }
    }
}