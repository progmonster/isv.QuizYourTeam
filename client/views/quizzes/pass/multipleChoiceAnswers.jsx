import React, { Fragment } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as PropTypes from 'prop-types';
import { green, red } from '@material-ui/core/colors';
import { compose } from 'redux';
import { Typography, withStyles } from '@material-ui/core';
import { Check, Clear } from '@material-ui/icons';

const styles = {
  answerLabel: {
    display: 'flex',
    alignItems: 'center',
  },

  uncheckedAnswer: {
  },

  validAnswer: {
    color: green[800],
  },

  correctUserAnswer: {
    color: green[800],
  },

  incorrectUserAnswer: {
    color: red[800],
  },
};

const MultipleChoiceAnswers = (
  {
    classes,
    answers,
    onAnswerChange,
    readOnly,
    checkAnswer,
  },
) => {
  const onAnswerComponentChange = (event, checked) => {
    // todo progmonster why if we have readOnly attribute?
    if (readOnly) {
      return;
    }

    onAnswerChange(Number(event.target.value), checked);
  };


  const renderCheckbox = checkedByUser => (
    <Checkbox
      checked={checkedByUser}
      onChange={onAnswerComponentChange}
      readOnly={readOnly}
    />
  );

  const getLabelWithAnswer = (title, checkedByUser, checked) => (
    <Typography className={classes.answerLabel}>
      {(checked && <span className={classes.correctUserAnswer}>{title}</span>)}
      {(!checked && <span>{title}</span>)}

      &nbsp;

      {(!checked && !checkedByUser && <Check className={classes.correctUserAnswer} />)}
      {(!checked && checkedByUser && <Clear className={classes.incorrectUserAnswer} />)}
      {(checked && !checkedByUser && <Clear className={classes.incorrectUserAnswer} />)}
      {(checked && checkedByUser && <Check className={classes.correctUserAnswer} />)}
    </Typography>
  );

  return (
    <FormGroup>
      {answers.map(({ title, checked = false, checkedByUser = false }, answerIdx) => (
        <FormControlLabel
          key={answerIdx}
          value={answerIdx.toString()}
          label={checkAnswer ? getLabelWithAnswer(title, checkedByUser, checked) : title}
          control={renderCheckbox(checkedByUser)}
        />
      ))}
    </FormGroup>
  );
};

MultipleChoiceAnswers.propTypes = {
  classes: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles),
)(MultipleChoiceAnswers);
