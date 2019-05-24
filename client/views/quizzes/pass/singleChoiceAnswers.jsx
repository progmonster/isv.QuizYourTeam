import React from 'react';
import * as PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function SingleChoiceAnswers({ answers, onAnswerChange }) {
  const onAnswerComponentChange = (event, checked) => {
    onAnswerChange(Number(event.target.value), checked);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={8}>
        <RadioGroup>
          {answers.map(({ title, checkedByUser = false }, answerIdx) => (
            <FormControlLabel
              key={answerIdx}
              value={answerIdx.toString()}
              label={title}
              control={<Radio checked={checkedByUser} onChange={onAnswerComponentChange} />}
            />
          ))}
        </RadioGroup>
      </Grid>
    </Grid>
  );
}

SingleChoiceAnswers.propTypes = {
  answers: PropTypes.array.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
};
