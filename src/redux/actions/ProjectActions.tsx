import { Project, ProjectAction, CREATE_NEW_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '../types/ProjectTypes';

export const createNewProject = (project: Project): ProjectAction => {
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