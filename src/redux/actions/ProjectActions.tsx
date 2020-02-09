import { Project, ProjectAction, CREATE_NEW_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, VIEW_PROJECT } from '../types/ProjectTypes';

export const createNewProject = (project: firebase.firestore.DocumentData): ProjectAction => {
    return {
        type: CREATE_NEW_PROJECT,
        payload: project
    }
}

export const updateProject = (project: Project): ProjectAction => {
    return {
        type: UPDATE_PROJECT,
        payload: project
    }
}

export const deleteProject = (project: Project): ProjectAction => {
    return {
        type: DELETE_PROJECT,
        payload: project
    }
}

export const viewProject = (project: firebase.firestore.DocumentData): ProjectAction => {
    return {
        type: VIEW_PROJECT,
        payload: project
    }
}