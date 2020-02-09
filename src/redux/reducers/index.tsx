import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProjectReducer from './ProjectReducer';

export default combineReducers({
    auth: AuthReducer,
    projects: ProjectReducer
})