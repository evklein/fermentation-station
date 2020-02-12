import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProjectReducer from './ProjectReducer';
import RecipeReducer from './RecipeReducer';

export default combineReducers({
    auth: AuthReducer,
    projects: ProjectReducer,
    recipes: RecipeReducer
})