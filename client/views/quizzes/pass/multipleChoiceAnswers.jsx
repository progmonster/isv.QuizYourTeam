import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as PropTypes from 'prop-types';
import { green, red } from '@material-ui/core/colors';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';

const styles = {
  validAnswer: {
    backgroundColor: green[50],
  },

  correctUserAnswer: {
    backgroundColor: green[500],
  },

  incorrectUserAnswer: {
    backgroundColor: red[500],
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

  const renderCheckbox = checkedByUser => (
    <Checkbox
      checked={checkedByUser}
      onChange={onAnswerComponentChange}
      readOnly={readOnly}
    />
  );

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={8}>
        <FormGroup>
          {answers.map(({ title, checked = false, checkedByUser = false }, answerIdx) => (
            <FormControlLabel
              classes={getAnswerClasses({
                checked,
                checkedByUser,
              })}
              key={answerIdx}
              value={answerIdx.toString()}
              label={title}
              control={renderCheckbox(checkedByUser)}
            />
          ))}
        </FormGroup>
      </Grid>
    </Grid>
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
