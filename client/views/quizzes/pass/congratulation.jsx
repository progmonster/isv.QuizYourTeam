import * as PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function Congratulation({ onPreviousStepGo, onLearningClose }) {
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
