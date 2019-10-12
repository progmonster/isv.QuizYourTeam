import React from 'react';
import size from 'lodash/size';
import withStyles from '@material-ui/core/styles/withStyles';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { green, orange, yellow } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Intro from './intro';
import Question from './question';
import Congratulation from './congratulation';
import withQuizPassPageContainer from './withQuizPassPageContainer';
import { QuizErrors } from '../../../../model/quiz';

const styles = {
  cardHeaderRoot: {
    backgroundColor: orange[500],
  },

  cardHeaderTitle: {
    color: 'white',
  },

  cardSubheaderTitle: {
    color: 'white',
  },

  actionsBlock: {
    marginTop: '4em',
  },

  passedDescription: {
    marginLeft: '2em',
    marginRight: '2em',
    color: green[500],
  },

  yourPassOutdatedNote: {
    color: yellow[800],
  },

  congratulationText: {
    marginTop: '3em',
    marginBottom: '3em',
    color: green[500],
  },

  introContent: {
    marginLeft: '2em',
    marginRight: '2em',
  },

  questionTitle: {
    marginTop: '1em',
    marginLeft: '2em',
    marginRight: '2em',
  },

  questionContent: {
    marginLeft: '2em',
    marginRight: '2em',
    marginTop: '2em',
    marginBottom: '4em',
  },

  answerBlock: {
    marginLeft: '2em',
    marginRight: '2em',
  },
};

class QuizPassPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
    };
  }

  getCurrentQuestion = () => {
    const { quiz } = this.props;

    const { currentStep } = this.state;

    return quiz && quiz.questions[currentStep - 1];
  };

  onPreviousStepGo = () => {
    this.setState(prevState => ({
      currentStep: Math.max(0, prevState.currentStep - 1),
    }));
  };

  onSeeResults = () => {
    this.setState({ currentStep: 1 });
  };

  onNextStepGo = async () => {
    const {
      quiz,
      onQuizStart,
      onQuizFinish,
      justPassed,
    } = this.props;

    const { currentStep } = this.state;

    const questionCount = size(quiz.questions);

    const nextStep = Math.min(questionCount + 1, currentStep + 1);

    if (currentStep === questionCount) {
      const finishStatus = justPassed || await onQuizFinish();

      if (finishStatus === true) {
        this.setState({
          currentStep: nextStep,
        });
      } else if (finishStatus.error === QuizErrors.QUIZ_YOU_JUST_PASSED_WAS_UPDATED) {
        this.setState({
          currentStep: 0,
        });

        onQuizStart();
      }
    } else {
      if (currentStep === 0) {
        onQuizStart();
      }

      this.setState({
        currentStep: nextStep,
      });
    }
  };

  onLearningClose = () => {
    const { history } = this.props;

    history.push('/dashboard');
  };

  onAnswerChange = (answerIdx, checked) => {
    const { onAnswerChange } = this.props;

    const { currentStep } = this.state;

    onAnswerChange(currentStep - 1, answerIdx, checked);
  };

  renderContent() {
    const {
      currentUserId,
      quiz,
      justPassed,
      classes
    } = this.props;

    if (!quiz) {
      return <div />;
    }

    const { currentStep } = this.state;

    const questionCount = size(quiz.questions);

    if (currentStep === 0) {
      return (
        <Intro
          classes={classes}
          currentUserId={currentUserId}
          quiz={quiz}
          onStart={this.onNextStepGo}
          onSeeResults={this.onSeeResults}
          justPassed={justPassed}
        />
      );
    }

    if (currentStep <= questionCount) {
      return (
        <Question
          classes={classes}
          question={this.getCurrentQuestion()}
          currentStep={currentStep}
          stepCount={questionCount}
          onPreviousStepGo={this.onPreviousStepGo}
          onNextStepGo={this.onNextStepGo}
          onAnswerChange={this.onAnswerChange}
          readOnly={justPassed}
          checkAnswer={justPassed}
          isIntroDisabled={!justPassed}
        />
      );
    }

    return (
      <Congratulation
        classes={classes}
        currentUserId={currentUserId}
        quiz={quiz}
        onPreviousStepGo={this.onPreviousStepGo}
        onQuizClose={this.onLearningClose}
        onSeeResults={this.onSeeResults}
        justPassed={justPassed}
      />
    );
  }

  render() {
    const {
      classes,
      quiz,
    } = this.props;

    if (!quiz) {
      return <div />;
    }

    return (
      <Grid container justify="space-around">
        <Grid item xs={12} xl={10}>
          <Card>
            <CardHeader
              classes={{
                root: classes.cardHeaderRoot,
                title: classes.cardHeaderTitle,
                subheader: classes.cardSubheaderTitle,
              }}

              title={quiz.title}
            />

            <CardContent>
              {this.renderContent()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

QuizPassPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  quiz: PropTypes.object,
  justPassed: PropTypes.bool.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onQuizStart: PropTypes.func.isRequired,
  onQuizFinish: PropTypes.func.isRequired,
};

QuizPassPage.defaultProps = {
  quiz: null,
};

export default compose(
  withStyles(styles),
  withQuizPassPageContainer,
)(QuizPassPage);
