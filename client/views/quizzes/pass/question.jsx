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
    question, currentStep, stepCount, onPreviousStepGo, onNextStepGo, onAnswerChange,
  },
) {
  const questionHtml = stateToHTML(convertFromRaw(question.editorState));

  const firstStep = currentStep === 1;

  const lastStep = currentStep === stepCount;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <QuestionStepTitle currentStep={currentStep} stepCount={stepCount} />
      </Grid>

      <Grid item xs={12} sm={12} md={12}>
        <p dangerouslySetInnerHTML={{ __html: questionHtml }} />
      </Grid>

      <Grid item xs={12} sm={12} md={12}>
        {question.answerType === SINGLE_CHOICE
          ? <SingleChoiceAnswers answers={question.answers} onAnswerChange={onAnswerChange} />
          : <MultipleChoiceAnswers answers={question.answers} onAnswerChange={onAnswerChange} />}
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Button variant="contained" color="primary" onClick={onPreviousStepGo}>
          {firstStep ? 'Intro' : 'Previous step'}
        </Button>

        <Button variant="contained" color="primary" onClick={onNextStepGo}>
          {lastStep ? 'Finish' : 'Next step'}
        </Button>
      </Grid>
    </Grid>
  );
}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
  onPreviousStepGo: PropTypes.func.isRequired,
  onNextStepGo: PropTypes.func.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
};
