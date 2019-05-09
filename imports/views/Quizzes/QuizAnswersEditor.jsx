import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import RadioGroup from '@material-ui/core/RadioGroup';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import { ANSWER_TYPES } from './AnswerTypes';
import { addAnswerToEditingQuiz, changeAnswerTypeInEditingQuiz } from '../../actions';
import SingleChoiceAnswer from './SingleChoiceAnswer';
import MultipleChoiceAnswer from './MultipleChoiceAnswer';

const styles = theme => ({
  quizAnswersEditor: {
    ...theme.mixins.gutters(), /* todo why? */
    paddingTop: theme.spacing.unit * 2, /* todo why? */
    paddingBottom: theme.spacing.unit * 2, /* todo why? */
  },
});

class QuizAnswersEditor extends React.PureComponent {
  render() {
    const {
      answerType,
      onAnswerAdd,
      onAnswerTypeChange,
    } = this.props;

    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={8}>
          <Tabs
            value={answerType === ANSWER_TYPES.SINGLE_CHOICE ? 0 : 1}

            onChange={(event, value) => onAnswerTypeChange(value === 0 ? ANSWER_TYPES.SINGLE_CHOICE : ANSWER_TYPES.MULTIPLE_CHOICE)
            }
          >
            <Tab label="Single choice" />
            <Tab label="Multiple choice" />
          </Tabs>

          {answerType === ANSWER_TYPES.SINGLE_CHOICE
            ? this._renderSingleChoiceAnswerBlock()
            : this._renderMultipleChoiceAnswerBlock()}
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAnswerAdd('', false)}
          >
            Add an answer
          </Button>
        </Grid>
      </Grid>
    );
  }

  _renderSingleChoiceAnswerBlock() {
    const {
      questionId,
      answers,
    } = this.props;

    return (
      <RadioGroup
        aria-label="Gender" /* todo */
        name="gender1"
      >
        {answers.allIds.map(answerId => (
          <SingleChoiceAnswer
            key={answerId}
            questionId={questionId}
            answerId={answerId}
          />
        ))}
      </RadioGroup>
    );
  }

  _renderMultipleChoiceAnswerBlock() {
    const {
      questionId,
      answers,
    } = this.props;

    return (
      <FormGroup
        aria-label="Gender" /* todo */
        name="gender1"
      >
        {answers.allIds.map(answerId => (
          <MultipleChoiceAnswer
            key={answerId}
            questionId={questionId}
            answerId={answerId}
          />
        ))}
      </FormGroup>
    );
  }
}

QuizAnswersEditor.propTypes = {
  classes: PropTypes.any,
  questionId: PropTypes.number,
  answerType: PropTypes.any,
  onAnswerAdd: PropTypes.func,
};

const mapStateToProps = (state, { questionId }) => ({ ...state.editingQuiz.questions.byId[questionId] });

const mapDispatchToProps = (dispatch, { questionId }) => ({
  onAnswerAdd: (title, checked) => {
    dispatch(addAnswerToEditingQuiz(questionId, title, checked));
  },

  onAnswerTypeChange: (answerType) => {
    dispatch(changeAnswerTypeInEditingQuiz(questionId, answerType));
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizAnswersEditor));
