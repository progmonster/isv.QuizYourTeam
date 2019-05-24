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
import { withTracker } from 'meteor/react-meteor-data';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Quizzes } from '../../../model/collections';

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

function Intro({ quiz, onLearningStart }) {
  const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <p dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }} />
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Button variant="contained" color="primary" onClick={onLearningStart}>
          Start learning!
        </Button>
      </Grid>
    </Grid>
  );
}

Intro.propTypes = {
  quiz: PropTypes.object.isRequired,
  onLearningStart: PropTypes.func.isRequired,
};

function Congratulation({ onPreviousStepGo, onLearningClose }) {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        {'Congratulation! You\'ve just finished learning!'}
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Button variant="contained" color="primary" onClick={onPreviousStepGo}>
          Previous step
        </Button>

        <Button variant="contained" color="primary" onClick={onLearningClose}>
          Exit learning
        </Button>
      </Grid>
    </Grid>
  );
}

Congratulation.propTypes = {
  onPreviousStepGo: PropTypes.func.isRequired,
  onLearningClose: PropTypes.func.isRequired,
};

function ParagraphStepTitle({ currentStep, stepCount }) {
  return (
    <Typography variant="h5">
      {`Step ${currentStep} from ${stepCount}`}
    </Typography>
  );
}

ParagraphStepTitle.propTypes = {
  currentStep: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
};

function Paragraph({ paragraph, currentStep, stepCount, onPreviousStepGo, onNextStepGo }) {
  const paragraphContentHtml = stateToHTML(convertFromRaw(paragraph.editorState));

  const firstStep = currentStep === 1;

  const lastStep = currentStep === stepCount;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <ParagraphStepTitle currentStep={currentStep} stepCount={stepCount} />
      </Grid>

      <Grid item xs={12} sm={12} md={12}>
        <p dangerouslySetInnerHTML={{ __html: paragraphContentHtml }} />
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Button variant="contained" color="primary" onClick={onPreviousStepGo}>
          {firstStep ? 'Intro' : 'Previous step'}
        </Button>

        <Button variant="contained" color="primary" onClick={onNextStepGo}>
          {lastStep ? 'Finish learning' : 'Next step'}
        </Button>
      </Grid>
    </Grid>
  );
}

Paragraph.propTypes = {
  paragraph: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
  onPreviousStepGo: PropTypes.func.isRequired,
  onNextStepGo: PropTypes.func.isRequired,
};

class QuizLearnPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
    };
  }

  onPreviousStepGo = () => {
    this.setState(prevState => ({
      currentStep: Math.max(0, prevState.currentStep - 1),
    }));
  };

  onNextStepGo = () => {
    const { quiz } = this.props;

    const paragraphCount = size(quiz.paragraphs);

    this.setState(prevState => ({
      currentStep: Math.min(paragraphCount + 1, prevState.currentStep + 1),
    }));
  };

  onLearningClose = () => {
    const { history } = this.props;

    history.push('/dashboard');
  };

  renderContent() {
    const { quiz } = this.props;

    const { currentStep } = this.state;

    const paragraphCount = size(quiz.paragraphs);

    if (currentStep === 0) {
      return <Intro quiz={quiz} onLearningStart={this.onNextStepGo} />;
    }

    if (currentStep <= paragraphCount) {
      return (
        <Paragraph
          paragraph={quiz.paragraphs[currentStep - 1]}
          currentStep={currentStep}
          stepCount={paragraphCount}
          onPreviousStepGo={this.onPreviousStepGo}
          onNextStepGo={this.onNextStepGo}
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

QuizLearnPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  quiz: PropTypes.object,
};

QuizLearnPage.defaultProps = {
  quiz: null,
};

export default compose(
  withStyles(styles),

  withTracker(({ match: { params: { quizId } } }) => {
    Meteor.subscribe('quiz', quizId);

    const quiz = Quizzes.findOne(quizId);

    return {
      quiz,
    };
  }),
)(QuizLearnPage);