import React, { Fragment } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as PropTypes from 'prop-types';
import { green, red } from '@material-ui/core/colors';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';

const styles = {
  uncheckedAnswer: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },

  validAnswer: {
    backgroundColor: green[100],
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },

  correctUserAnswer: {
    backgroundColor: green[300],
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },

  incorrectUserAnswer: {
    backgroundColor: red[100],
    marginTop: '0.5em',
    marginBottom: '0.5em',
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

  const isCorrectAnswer = (checked, checkedByUser) => checked && checkedByUser
    || !checked && !checkedByUser;

  const getAnswerClasses = ({ checked, checkedByUser }) => {
    if (!checkAnswer) {
      return { root: classes.uncheckedAnswer };
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

  const renderCheckbox = checkedByUser => (
    <Checkbox
      checked={checkedByUser}
      onChange={onAnswerComponentChange}
      readOnly={readOnly}
    />
  );

  return (
    <FormGroup>
        {answers.map(({ title, checked = false, checkedByUser = false }, answerIdx) => (
          <Grid container key={answerIdx}>
            <Grid item xs={11}>
              <FormControlLabel
                classes={getAnswerClasses({
                  checked,
                  checkedByUser,
                })}
                value={answerIdx.toString()}
                label={title}
                control={renderCheckbox(checkedByUser)}
              />
            </Grid>

            {checkAnswer && (
              <Grid item xs={1}>
                {isCorrectAnswer(checked, checkedByUser) && "X" || "V"}
              </Grid>
            )}
          </Grid>
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
