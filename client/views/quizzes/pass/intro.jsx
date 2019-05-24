import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import * as PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function Intro({ quiz, onLearningStart }) {
  const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <p dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }} />
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Button variant="contained" color="primary" onClick={onLearningStart}>
          Start quiz!
        </Button>
      </Grid>
    </Grid>
  );
}

Intro.propTypes = {
  quiz: PropTypes.object.isRequired,
  onLearningStart: PropTypes.func.isRequired,
};
