import React from 'react';
import size from 'lodash/size';
import withStyles from '@material-ui/core/styles/withStyles';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { orange } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Intro from './intro';
import Question from './question';
import Congratulation from './congratulation';
import withQuizPassPageContainer from './withQuizPassPageContainer';

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

  onNextStepGo = () => {
    const { quiz } = this.props;

    const questionCount = size(quiz.questions);

    this.setState(prevState => ({
      currentStep: Math.min(questionCount + 1, prevState.currentStep + 1),
    }));
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
      quiz,
    } = this.props;

    if (!quiz) {
      return <div />;
    }

    const { currentStep } = this.state;

    const questionCount = size(quiz.questions);

    if (currentStep === 0) {
      return <Intro quiz={quiz} onLearningStart={this.onNextStepGo} />;
    }

    if (currentStep <= questionCount) {
      return (
        <Question
          question={this.getCurrentQuestion()}
          currentStep={currentStep}
          stepCount={questionCount}
          onPreviousStepGo={this.onPreviousStepGo}
          onNextStepGo={this.onNextStepGo}
          onAnswerChange={this.onAnswerChange}
        />
      );
    }

    return (
      <Congratulation
        onPreviousStepGo={this.onPreviousStepGo}
        onLearningClose={this.onLearningClose}
      />
    );
  }

  render() {
    const {
      classes,
    } = this.props;

    const {
      quiz,
    } = this.props;

    if (!quiz) {
      return <div />;
    }

    return (
      <Grid container justify="space-around">
        <Grid item xs={12} sm={12} md={8}>
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
  quiz: PropTypes.object,
  onAnswerChange: PropTypes.func.isRequired,
};

QuizPassPage.defaultProps = {
  quiz: null,
};

export default compose(
  withStyles(styles),
  withQuizPassPageContainer,
)(QuizPassPage);
