import * as PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function Congratulation(
  {
    classes,
    currentUserId,
    quiz,
    onPreviousStepGo,
    onQuizClose,
    onSeeResults,
    justPassed,
  },
) {
  const {
    result,
    maxPossibleResult,
    totalQuestionNumber,
    answeredCorrectlyQuestionNumber,
  } = quiz.getPassInfoByUserId(currentUserId);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        {'Congratulation! You\'ve just finished quiz!'}
        <br />
        {`You've answered correctly on ${answeredCorrectlyQuestionNumber} from ${totalQuestionNumber} questions`}
        <br />
        {`You've achieved ${result} from ${maxPossibleResult} points`}
      </Grid>

      <Grid item xs={12} container className={classes.actionsBlock} justify="space-between">
        <Grid item>
          <Button variant="contained" color="primary" onClick={onSeeResults}>
            See results
          </Button>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={onQuizClose}>
            Exit quiz
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

Congratulation.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  quiz: PropTypes.object.isRequired,
  onPreviousStepGo: PropTypes.func.isRequired,
  onQuizClose: PropTypes.func.isRequired,
  onSeeResults: PropTypes.func.isRequired,
  justPassed: PropTypes.bool.isRequired,
};
