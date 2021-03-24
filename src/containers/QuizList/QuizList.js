import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './QuizLis.module.css';
import Loader from '../../components/Ui/Loader/Loader';
import { fetchQuizes } from '../../store/actions/quiz';
import { connect } from 'react-redux';

class QuizList extends Component {
  renderQuizes() {
    return this.props.quizes.map((quiz) => {
      return (
        <li key={quiz.id}>
          <NavLink to={'/quiz/' + quiz.id}>Тест {quiz.name}</NavLink>
        </li>
      );
    });
  }
  // почти всегда для работы с backend
  componentDidMount() {
    this.props.fetchQuizes();
  }

  render() {
    return (
      <div className={classes.QuizList}>
        <div>
          <h1>Список Тестов</h1>
          {/* Добавление loader */}
          {this.props.loading && this.props.quizes !== 0 ? (
            <Loader />
          ) : (
            <ul>{this.renderQuizes()}</ul>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quizes: state.quiz.quizes,
    loading: state.quiz.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchQuizes: () => dispatch(fetchQuizes()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizList);
