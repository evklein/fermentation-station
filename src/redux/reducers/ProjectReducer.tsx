
import { Project, ProjectAction, CREATE_NEW_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, VIEW_PROJECT, ProjectState } from '../types/ProjectTypes';

const defaultProjectState = {
    userProjects: [] as firebase.firestore.DocumentData[],
    currentlyViewedProject: {} as firebase.firestore.DocumentData
}

const ProjectReducer = (state = defaultProjectState, action: ProjectAction) => {
    switch (action.type) {
        case CREATE_NEW_PROJECT:
            return {
                ...state,
                userProjects: [...state.userProjects, action.payload]
            }
        case UPDATE_PROJECT:
            return {
                ...state,
                userProjects: [...state.userProjects.filter((project) => {
                    return project.documentID !== action.documentID
                }), action.payload],
                currentlyViewedProject: {} // Reset since we are no longer viewing this particular item.
            }
        case DELETE_PROJECT:
            return {
                ...state,
                userProjects: [...state.userProjects.filter((project) => { return project.documentID !== action.documentID})]
            }
        case VIEW_PROJECT:
            return {
                ...state,
                currentlyViewedProject: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default ProjectReducer;