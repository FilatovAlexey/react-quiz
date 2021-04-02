import React, { Component } from 'react';
import classes from './QuizCreator.module.css';
import Input from '../../components/Ui/Input/Input';
import Select from '../../components/Ui/Select/Select';
import Button from '../../components/Ui/Button/Button';
import {
  createControl,
  validate,
  validateForm,
} from '../../form/formFramework';
import { connect } from 'react-redux';
import {
  createQuizQuestion,
  finishCreateQuiz,
} from '../../store/actions/create';

function createOptionControl(number) {
  return createControl(
    {
      label: `Вариант ${number}`,
      errorMessage: 'Значение не может быть пустым!',
      id: number,
    },
    { required: true }
  );
}
function createFormControls() {
  return {
    question: createControl(
      {
        label: 'Ведите вопрос',
        errorMessage: ' Вопрос не может быть пустым!',
      },
      { required: true }
    ),
    option1: createOptionControl(1),
    option2: createOptionControl(2),
    option3: createOptionControl(3),
    option4: createOptionControl(4),
  };
}

class QuizCreator extends Component {
  state = {
    isFormValid: false,
    rightAnswerId: 1,
    formControls: createFormControls(),
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  addQuestionHandler = (event) => {
    event.preventDefault();

    //деструктуризация
    const {
      question,
      option1,
      option2,
      option3,
      option4,
    } = this.state.formControls;

    const questionItem = {
      question: question.value,
      id: this.props.quiz.length + 1,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        {
          text: option1.value,
          id: option1.id,
        },
        {
          text: option2.value,
          id: option2.id,
        },
        {
          text: option3.value,
          id: option3.id,
        },
        {
          text: option4.value,
          id: option4.id,
        },
      ],
    };
    this.props.createQuizQuestion(questionItem);
    this.setState({
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormControls(),
    });
  };
  createQuizHandler = (event) => {
    event.preventDefault();
    //добавление вопросов на сервер

    this.setState({
      quiz: [],
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormControls(),
    });
    this.props.finishCreateQuiz();
  };
  changeHandler = (value, controlName) => {
    const formControls = { ...this.state.formControls };
    const control = { ...formControls[controlName] };

    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation);

    formControls[controlName] = control;

    this.setState({
      formControls,
      isFormValid: validateForm(formControls),
    });
  };
  renderInputs() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName];

      return (
        <React.Fragment key={controlName + index}>
          <Input
            label={control.label}
            value={control.value}
            valid={control.valid}
            shouldValidate={!!control.validation}
            touched={control.touched}
            errorMessage={control.errorMessage}
            onChange={(event) => {
              this.changeHandler(event.target.value, controlName);
            }}
          />
          {index === 0 ? <hr /> : null}
        </React.Fragment>
      );
    });
  }

  selectChangeHandler = (event) => {
    this.setState({
      rightAnswerId: +event.target.value,
    });
  };
  render() {
    const select = (
      <Select
        label="Выберете правильный ответ"
        value={this.state.rightAnswerId}
        onChange={this.selectChangeHandler}
        options={[
          { text: 1, value: 1 },
          { text: 2, value: 2 },
          { text: 3, value: 3 },
          { text: 4, value: 4 },
        ]}
      />
    );
    return (
      <div className={classes.QuizCreator}>
        <div>
          <h1>Создание теста</h1>
          <form onSubmit={this.submitHandler}>
            {this.renderInputs()}
            {select}
            <Button
              type="primary"
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Добавить Вопрос
            </Button>

            <Button
              type="success"
              onClick={this.createQuizHandler}
              disabled={this.props.quiz.length === 0}
            >
              Создать Тест
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quiz: state.create.quiz,
  };
}

function mapDispatchToprops(dispatch) {
  return {
    createQuizQuestion: (item) => dispatch(createQuizQuestion(item)),
    finishCreateQuiz: () => dispatch(finishCreateQuiz()),
  };
}

export default connect(mapStateToProps, mapDispatchToprops)(QuizCreator);
