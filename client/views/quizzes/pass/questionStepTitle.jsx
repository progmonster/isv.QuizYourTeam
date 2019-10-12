import * as PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function QuestionStepTitle({ currentStep, stepCount }) {
  return (
    <Typography variant="h5">
      {`Question ${currentStep} from ${stepCount}`}
    </Typography>
  );
}

QuestionStepTitle.propTypes = {
  currentStep: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
};
