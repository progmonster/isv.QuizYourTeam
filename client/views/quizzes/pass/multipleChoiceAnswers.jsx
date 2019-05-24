import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as PropTypes from 'prop-types';

export default function MultipleChoiceAnswers({ answers, onAnswerChange }) {
  const onAnswerComponentChange = (event, checked) => {
    onAnswerChange(Number(event.target.value), checked);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={8}>
        <FormGroup>
          {answers.map(({ title, checkedByUser = false }, answerIdx) => (
            <FormControlLabel
              key={answerIdx}
              value={answerIdx.toString()}
              label={title}
              control={<Checkbox checked={checkedByUser} onChange={onAnswerComponentChange} />}
            />
          ))}
        </FormGroup>
      </Grid>
    </Grid>
  );
}

MultipleChoiceAnswers.propTypes = {
  answers: PropTypes.array.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
};
