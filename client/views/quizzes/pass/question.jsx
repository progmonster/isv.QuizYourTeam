import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import * as PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import QuestionStepTitle from './questionStepTitle';
import MultipleChoiceAnswers from './multipleChoiceAnswers';
import SingleChoiceAnswers from './singleChoiceAnswers';
import { SINGLE_CHOICE } from '../../../../model/answerTypes';

export default function Question(
  {
    classes,
    question,
    currentStep,
    stepCount,
    onPreviousStepGo,
    onNextStepGo,
    onAnswerChange,
    readOnly,
    checkAnswer,
    isIntroDisabled,
  },
) {
  const questionHtml = stateToHTML(convertFromRaw(question.editorState));

  const firstStep = currentStep === 1;

  const lastStep = currentStep === stepCount;

  const renderSingleChoiceAnswers = () => (
    <SingleChoiceAnswers
      answers={question.answers}
      onAnswerChange={onAnswerChange}
      readOnly={readOnly}
      checkAnswer={checkAnswer}
    />
  );

  const renderMultipleChoiceAnswers = () => (
    <MultipleChoiceAnswers
      answers={question.answers}
      onAnswerChange={onAnswerChange}
      readOnly={readOnly}
      checkAnswer={checkAnswer}
    />
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <QuestionStepTitle currentStep={currentStep} stepCount={stepCount} />
      </Grid>

      <Grid item xs={12}>
        <p dangerouslySetInnerHTML={{ __html: questionHtml }} />
      </Grid>

      <Grid item xs={12}>
        {question.answerType === SINGLE_CHOICE
          ? renderSingleChoiceAnswers()
          : renderMultipleChoiceAnswers()}
      </Grid>

      <Grid item xs={12} container className={classes.actionsBlock} justify="space-between">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={onPreviousStepGo}
            disabled={firstStep && isIntroDisabled}
          >
            {firstStep ? 'Intro' : 'Previous step'}
          </Button>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={onNextStepGo}>
            {lastStep ? 'Finish' : 'Next step'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

Question.propTypes = {
  classes: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
  onPreviousStepGo: PropTypes.func.isRequired,
  onNextStepGo: PropTypes.func.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  isIntroDisabled: PropTypes.bool.isRequired,
};
