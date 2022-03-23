import {combineReducers} from 'redux';
import {USER_LOGOUT} from '../actions/types';
import UserDataReducer from './ReducerUserData';
import SelecTab from './ReducerSelectedTab';
import UnreadNotification from './unreadNotification';
import MyStorage from '../../components/helpers/myStorage';
import CatagorystatesReducer from './ReducerFilterForIndustry';
const combinedReducer = combineReducers({
  user_data: UserDataReducer,
  select_tab: SelecTab,
  unreadNotification: UnreadNotification,
  catagorystatesReducer: CatagorystatesReducer,
});
const rootReducer = (state, action) => {
  if (action.type == USER_LOGOUT) {
    new MyStorage().clearStorage();
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};
export default rootReducer;
