import React from 'react';
import { Tracker } from 'meteor/tracker';
import { produce } from 'immer';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as PropTypes from 'prop-types';
import { Quizzes } from '../../../../model/collections';
import { SINGLE_CHOICE } from '../../../../model/answerTypes';

export default WrappedComponent => class WithQuizPassPageContainer extends React.Component {
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
    };
  }

  componentDidMount() {
    this.quizSubscription = Meteor.subscribe('quiz', this.getQuizId());

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
      quiz: newState,
    });
  };

  render() {
    const { quiz } = this.state;

    return (
      <WrappedComponent
        {...this.props}
        quizId={this.getQuizId()}
        quiz={quiz}
        onAnswerChange={this.onAnswerChange}
      />
    );
  }
};
