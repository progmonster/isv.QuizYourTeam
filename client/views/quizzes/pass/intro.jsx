import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import * as PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function Intro({ classes, currentUserId, quiz, onStart, onSeeResults, justPassed }) {
  const passInfo = quiz.getPassInfoByUserId(currentUserId);

  const {
    answeredCorrectlyQuestionNumber,
    totalQuestionNumber,
    result,
    maxPossibleResult,
    passedAt,
  } = passInfo || {};

  const passed = !!passInfo || justPassed;

  const quizUpdatedAfterCurrentUserPassed = passed
    && (passedAt.getTime() < quiz.updatedAt.getTime());

  const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

  return (
    <Grid container>
      {passed && (
        <Grid item xs={12} className={classes.passedDescription}>
          {justPassed && (
            <p>You&apos;ve just passed the quiz. You can restart it to improve the result.</p>
          )}

          {!justPassed && (
            <p>You passed the quiz. You can restart it to improve the result.</p>
          )}

          <p>
            {`You've answered correctly on ${answeredCorrectlyQuestionNumber} from ${totalQuestionNumber} questions`}
          </p>

          <p>
            {`You've achieved ${result} from ${maxPossibleResult} points`}
          </p>

          {quizUpdatedAfterCurrentUserPassed && (
            <p className={classes.yourPassOutdatedNote}>
              {'You didn\'t pass updated version yet!'}
            </p>
          )}
        </Grid>
      )}

      <Grid item xs={12}>
        <p dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }} />
      </Grid>

      <Grid item xs={12} container className={classes.actionsBlock} justify="space-between">
        <Grid item>
          <Button variant="contained" color="secondary" onClick={onStart}>
            {passed ? 'Restart quiz!' : 'Start quiz!'}
          </Button>
        </Grid>

        {justPassed && (
          <Grid item>
            <Button variant="contained" color="primary" onClick={onSeeResults}>
              See results
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

Intro.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  quiz: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onSeeResults: PropTypes.func.isRequired,
  justPassed: PropTypes.bool.isRequired,
};
