import { Project, ProjectAction, CREATE_NEW_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, VIEW_PROJECT, DELETE_ALL } from '../types/ProjectTypes';

export const createNewProject = (project: firebase.firestore.DocumentData): ProjectAction => {
    return {
        type: CREATE_NEW_PROJECT,
        payload: project,
        documentID: ''
    }
}

export const updateProject = (project: firebase.firestore.DocumentData, documentID: string): ProjectAction => {
    return {
        type: UPDATE_PROJECT,
        payload: project,
        documentID: documentID
    }
}

export const deleteProject = (project: firebase.firestore.DocumentData, documentID: string): ProjectAction => {
    return {
        type: DELETE_PROJECT,
        payload: project,
        documentID: documentID
    }
}

export const viewProject = (project: firebase.firestore.DocumentData): ProjectAction => {
    return {
        type: VIEW_PROJECT,
        payload: project,
        documentID: ''
    }
}

export const deleteAll = (): ProjectAction => {
    return {
        type: DELETE_ALL,
        payload: {},
        documentID: ''
    }
}