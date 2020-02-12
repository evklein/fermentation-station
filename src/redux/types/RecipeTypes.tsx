export const CREATE_NEW_RECIPE: string = "CREATE_NEW_RECIPE";
export const UPDATE_RECIPE: string = "UPDATE_RECIPE";
export const DELETE_RECIPE: string = "DELETE_RECIPE";
export const VIEW_RECIPE: string = "VIEW_RECIPE";
export const DELETE_ALL_RECIPES: string = "DELETE_ALL_RECIPES";

export interface Recipe {
    name: string
    owner: string
    ingredientsList: string
    instructions: string
}

export interface RecipeAction {
    type: string
    payload: firebase.firestore.DocumentData
    documentID: string
}