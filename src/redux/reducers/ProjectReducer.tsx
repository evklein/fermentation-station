
import { Project, ProjectAction, CREATE_NEW_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '../types/ProjectTypes';

const defaultProjectState = {
    projects: []
}

const ProjectReducer = (state = defaultProjectState, action: ProjectAction) => {
    switch (action.type) {
        case CREATE_NEW_PROJECT:
            return {
                ...state
            }
        case UPDATE_PROJECT:
            return {
                ...state
            }
        case DELETE_PROJECT:
            return {
                ...state
            }
        default:
            return {
                ...state
            }
    }
}