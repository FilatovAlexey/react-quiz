import { combineReducers } from 'redux';
import quizReduser from './quiz';
import createReduser from './create';
import authReduser from './auth';

export default combineReducers({
  quiz: quizReduser,
  create: createReduser,
  auth: authReduser,
});
