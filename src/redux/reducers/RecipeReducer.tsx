import { RecipeAction, CREATE_NEW_RECIPE, UPDATE_RECIPE, DELETE_RECIPE, VIEW_RECIPE } from "../types/RecipeTypes";
import { DELETE_ALL } from "../types/ProjectTypes";

const defaultRecipeState = {
    userRecipes: [] as firebase.firestore.DocumentData[],
    currentlyViewedRecipe: {} as firebase.firestore.DocumentData
}

const ProjectReducer = (state = defaultRecipeState, action: RecipeAction) => {
    switch (action.type) {
        case CREATE_NEW_RECIPE:
            return {
                ...state,
                userRecipes: [...state.userRecipes, action.payload],
                currentlyViewedRecipe: {}
            }
        case UPDATE_RECIPE:
            return {
                ...state,
                userRecipes: [...state.userRecipes.filter((recipe) => {
                    return recipe.documentID !== action.documentID
                }), action.payload],
                currentlyViewedRecipe: {}
            }
        case DELETE_RECIPE:
            return {
                ...state,
                userRecipes: [...state.userRecipes.filter((recipe) => { return recipe.documentID !== action.documentID })],
                currentlyViewedRecipe: {}
            }
        case VIEW_RECIPE:
            return {
                ...state,
                currentlyViewedRecipe: action.payload
            }
        case DELETE_ALL:
            return {
                ...state,
                userRecipes: [],
                currentlyViewedRecipe: {}
            }
        default:
            return {
                ...state
            }
    }
};

export default ProjectReducer;