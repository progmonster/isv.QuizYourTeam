import withStyles from '@material-ui/core/styles/withStyles';
import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import {
  changeAnswerCheckStateInEditingQuiz,
  changeAnswerTitleInEditingQuiz,
  removeAnswerFromEditingQuiz,
} from '../../services/actions';

const styles = theme => ({});

class SingleChoiceAnswer extends React.PureComponent {
  render() {
    const {
      answerId,
    } = this.props;

    return (<FormControlLabel value={answerId.toString()} control={this._renderLabelChildren()}
                              label="" />);
  }

  _renderLabelChildren() {
    const {
      title,
      checked,
      onRemove,
      onTitleChange,
      onCheckStateChange,
    } = this.props;

    return (
      <Fragment>
        <Radio
          color="secondary"
          checked={checked}
          onChange={() => onCheckStateChange(true)}
        />

        <TextField
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          margin="normal"
          fullWidth
          placeholder="Write an answer variant here. Select this answer if it is correct variant..."
        />

        <IconButton
          aria-label="Delete the answer"
          color="secondary"
          onClick={onRemove}
        >
          <DeleteIcon />
        </IconButton>
      </Fragment>
    );
  }
}

SingleChoiceAnswer.propTypes = {
  questionId: PropTypes.number,
  answerId: PropTypes.number,
  title: PropTypes.string,
  checked: PropTypes.bool,
  onRemove: PropTypes.func,
  onTitleChange: PropTypes.func,
  onCheckStateChange: PropTypes.func,
};

const mapStateToProps = (state, { questionId, answerId }) => ({ ...state.editingQuiz.questions.byId[questionId].answers.byId[answerId] });

const mapDispatchToProps = (dispatch, { questionId, answerId }) => ({
  onRemove: () => {
    dispatch(removeAnswerFromEditingQuiz(questionId, answerId));
  },

  onTitleChange: (title) => {
    dispatch(changeAnswerTitleInEditingQuiz(questionId, answerId, title));
  },

  onCheckStateChange: (checked) => {
    dispatch(changeAnswerCheckStateInEditingQuiz(questionId, answerId, checked));
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SingleChoiceAnswer));
