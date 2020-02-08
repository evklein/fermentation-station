export const CREATE: string = "ERROR";
export const LOGIN: string = "LOGIN";
export const LOGOUT: string = "LOGOUT";

export default interface UserAuthAction {
    type: string
    payload: {
        email: string
        password: string
    }
}