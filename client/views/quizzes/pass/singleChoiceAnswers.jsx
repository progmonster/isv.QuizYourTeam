import React from 'react';
import * as PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

const SingleChoiceAnswers = (
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

  const getAnswerClasses = ({ checked, checkedByUser }) => {
    if (!checkAnswer) {
      return {};
    }

    if (checked) {
      if (checkedByUser) {
        return { root: classes.correctUserAnswer };
      }

      return { root: classes.validAnswer };
    }

    if (checkedByUser) {
      return { root: classes.incorrectUserAnswer };
    }

    return {};
  };

  const renderRadio = checkedByUser => (
    <Radio
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
    <RadioGroup>
      {answers.map(({ title, checked = false, checkedByUser = false }, answerIdx) => (
        <FormControlLabel
          classes={getAnswerClasses({
            checked,
            checkedByUser,
          })}
          key={answerIdx}
          value={answerIdx.toString()}
          label={checkAnswer ? getLabelWithAnswer(title, checkedByUser, checked) : title}
          control={renderRadio(checkedByUser)}
        />
      ))}
    </RadioGroup>
  );
};

SingleChoiceAnswers.propTypes = {
  classes: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles),
)(SingleChoiceAnswers);
