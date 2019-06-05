import React from 'react';
import { connect } from 'react-redux';
import { Tracker } from 'meteor/tracker';
import { produce } from 'immer';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import { Quizzes } from '../../../../model/collections';
import { SINGLE_CHOICE } from '../../../../model/answerTypes';
import quizService from '../../../services/quizService';
import Quiz from '../../../../model/quiz';
import { snackbarActions as snackbar } from '../../../components/snackbar';

const withQuizPassPageContainer = WrappedComponent => class WithQuizPassPageContainer
  extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        quizId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      quiz: null,
      justPassed: false,
      currentUserId: Meteor.userId(),
    };
  }

  componentDidMount() {
    this.quizSubscription = Meteor.subscribe('quiz', this.getQuizId());

    Tracker.autorun(() => {
      this.setState({
        currentUserId: Meteor.userId(),
      });
    });

    Tracker.autorun((computation) => {
      if (this.quizSubscription.ready()) {
        this.setState({
          quiz: Quizzes.findOne(this.getQuizId()),
        });

        computation.stop();
      }
    });
  }

  componentWillUnmount() {
    this.quizSubscription.stop();
  }

  getQuizId = () => {
    const { match: { params: { quizId } } } = this.props;

    return quizId;
  };

  onAnswerChange = (questionIdx, answerIdx, checked) => {
    const { quiz } = this.state;

    const newState = produce(quiz, (draftQuiz) => {
      const question = draftQuiz.questions[questionIdx];

      const { answers } = question;

      if (question.answerType === SINGLE_CHOICE) {
        answers.forEach((answer) => {
          answer.checkedByUser = false;
        });
      }

      answers[answerIdx].checkedByUser = checked;
    });

    this.setState({
      quiz: new Quiz(newState),
    });
  };

  onQuizStart = () => {
    const { quiz } = this.state;

    const newState = produce(
      quiz,
      draftQuiz => draftQuiz.questions.flatMap(question => question.answers)
        .forEach((answer) => {
          answer.checkedByUser = false;
        }),
    );

    this.setState({
      justPassed: false,
      quiz: new Quiz(newState),
    });
  };

  onQuizFinish = async () => {
    const { dispatch } = this.props;

    const { quiz } = this.state;

    try {
      const userAnswers = quiz.questions.map(
        question => question.answers.map(
          ({ checkedByUser }) => ({ checked: checkedByUser || false }),
        ),
      );

      const passResult = await quizService.sendAnswers(quiz._id, quiz.updatedAt, userAnswers);

      dispatch(snackbar.show({ message: 'You result has been successfully saved!' }));

      this.setState({
        justPassed: true,

        quiz: new Quiz({
          ...quiz,
          passed: [...quiz.passed || [], passResult],
        }),
      });

      return true;
    } catch (error) {
      console.log(error);

      dispatch(snackbar.show({ message: `Error saving the quiz result: ${error.message}` }));

      return false;
    }
  };

  render() {
    const { currentUserId, quiz, justPassed } = this.state;

    return (
      <WrappedComponent
        {...this.props}
        currentUserId={currentUserId}
        quizId={this.getQuizId()}
        quiz={quiz}
        justPassed={justPassed}
        onAnswerChange={this.onAnswerChange}
        onQuizStart={this.onQuizStart}
        onQuizFinish={this.onQuizFinish}
      />
    );
  }
};

export default compose(
  connect(),
  withQuizPassPageContainer,
);
