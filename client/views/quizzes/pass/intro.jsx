import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import * as PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function Intro({ currentUserId, quiz, onStart, onSeeResults, justPassed }) {
  const passInfo = quiz.getPassInfoByUserId(currentUserId);

  const {
    answeredCorrectlyQuestionNumber,
    totalQuestionNumber,
    result,
    maxPossibleResult,
  } = passInfo || {};

  const passed = !!passInfo || justPassed;

  const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

  return (
    <Grid container>
      {passed && (
        <Grid item xs={12} sm={12} md={12}>
          {justPassed && (
            <p>You&apos;ve just passed the quiz. You can restart it to improve the result.</p>
          )}

          {!justPassed && (
            <p>You passed the quiz. You can restart it to improve the result.</p>
          )}

          <br />
          {`You've answered correctly on ${answeredCorrectlyQuestionNumber} from ${totalQuestionNumber} questions`}
          <br />
          {`You've achieved ${result} from ${maxPossibleResult} points`}
        </Grid>
      )}

      <Grid item xs={12} sm={12} md={12}>
        <p dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }} />
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Button variant="contained" color="primary" onClick={onStart}>
          {passed ? 'Restart quiz!' : 'Start quiz!'}
        </Button>
      </Grid>

      {justPassed && (
        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={onSeeResults}>
            See results
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

Intro.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  quiz: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onSeeResults: PropTypes.func.isRequired,
  justPassed: PropTypes.bool.isRequired,
};
