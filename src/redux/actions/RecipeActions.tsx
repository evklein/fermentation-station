
import { CREATE_NEW_RECIPE, RecipeAction, UPDATE_RECIPE, DELETE_RECIPE, DELETE_ALL_RECIPES } from '../types/RecipeTypes';
import { ProjectAction } from '../types/ProjectTypes';

export const createNewRecipe = (recipe: firebase.firestore.DocumentData): RecipeAction => {
    return {
        type: CREATE_NEW_RECIPE,
        payload: recipe,
        documentID: ''
    }
}

export const updateRecipe = (recipe: firebase.firestore.DocumentData, documentID: string): RecipeAction => {
    return {
        type: UPDATE_RECIPE,
        payload: recipe,
        documentID: documentID
    }
}

export const deleteRecipe = (recipe: firebase.firestore.DocumentData, documentID: string): RecipeAction => {
    return {
        type: DELETE_RECIPE,
        payload: recipe,
        documentID: documentID
    }
}

export const viewRecipe = (recipe: firebase.firestore.DocumentData): RecipeAction => {
    return {
        type: UPDATE_RECIPE,
        payload: recipe,
        documentID: ''
    }
}

export const deleteAll = (): ProjectAction => {
    return {
        type: DELETE_ALL_RECIPES,
        payload: {},
        documentID: ''
    }
}