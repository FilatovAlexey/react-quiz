import { combineReducers } from 'redux';
import quizReduser from './quiz';

export default combineReducers({
  quiz: quizReduser,
});
