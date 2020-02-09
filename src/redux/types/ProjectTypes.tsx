// Project actions
export const CREATE_NEW_PROJECT: string = "CREATE_NEW_PROJECT";
export const UPDATE_PROJECT: string = "UPDATE_PROJECT";
export const DELETE_PROJECT: string = "DELETE_PROJECT";
export const VIEW_PROJECT: string = "VIEW_PROJECT";

export interface Project {
    name: string
    owner: string
    status: string
    startDate: Date
    doneDate: Date
    burpHours: number
    feedHours: number
    feedMaterial: number
    notes: string
}

export interface ProjectAction {
    type: string
    payload: firebase.firestore.DocumentData
}

export interface ProjectState {
    userProjects: firebase.firestore.DocumentData[],
    currentlyViewedProject: firebase.firestore.DocumentData
}