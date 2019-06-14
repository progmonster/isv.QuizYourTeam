import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import QuizAnswersEditor from './quizAnswersEditor';
import {
  changeQuestionEditorStateInEditingQuiz,
  removeQuestionFromEditingQuiz,
} from '../../services/actions';

const styles = theme => ({
  quizQuestionEditor: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2, /* todo why? */
    paddingBottom: theme.spacing.unit * 2, /* todo why? */
  },

  answersBlockStart: {
    marginTop: '2em',
  },
});

class QuizQuestionEditor extends React.PureComponent {
  render() {
    const {
      classes,
      id: questionId,
      number: questionNumber,
      editorState,
      onQuestionEditorStateChange,
      onQuestionRemove,
    } = this.props;

    return (
      <Paper className={classes.quizQuestionEditor} elevation={1}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              Question #
              {questionNumber}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"/* todo remove these class */
              editorClassName="demo-editor"
              onEditorStateChange={onQuestionEditorStateChange}
              placeholder={`Type your question #${questionNumber} here...`}
            />
          </Grid>

          <Grid item xs={12} className={classes.answersBlockStart}>
            <Typography variant="h5" component="h3">
              Answers
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <QuizAnswersEditor questionId={questionId} />
          </Grid>

          <Grid item xs={12} container justify="flex-end" alignItems="flex-start">
            <Button variant="contained" color="secondary" onClick={onQuestionRemove}>
              Remove
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

QuizQuestionEditor.propTypes = {
  classes: PropTypes.any,
  id: PropTypes.number,
  number: PropTypes.number,
  onQuestionEditorStateChange: PropTypes.func,
  onQuestionRemove: PropTypes.func,
};

const mapStateToProps = (state, { id }) => ({ ...state.editingQuiz.questions.byId[id] });

const mapDispatchToProps = (dispatch, { id: questionId }) => ({
  onQuestionEditorStateChange: (state) => {
    dispatch(changeQuestionEditorStateInEditingQuiz(questionId, state));
  },

  onQuestionRemove: () => {
    dispatch(removeQuestionFromEditingQuiz(questionId));
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizQuestionEditor));
