import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import { changeParagraphEditorStateInEditingQuiz } from '/client/services/actions';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { removeParagraphFromEditingQuiz } from '../../services/actions';

const styles = theme => ({
  cardCategoryWhite: {/* todo remove? */
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {/* todo remove? */
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    marginBottom: '3px',
    textDecoration: 'none',
  },
  quizParagraphEditor: {
    ...theme.mixins.gutters(), /* todo why? */
    paddingTop: theme.spacing.unit * 2, /* todo why? */
    paddingBottom: theme.spacing.unit * 2, /* todo why? */
  },
});

class QuizParagraphEditor extends React.PureComponent {
  render() {
    const {
      number, editorState, onParagraphEditorStateChange, onParagraphRemove, classes,
    } = this.props;

    return (
      <Paper className={classes.quizParagraphEditor} elevation={1}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              Paragraph #
              {number}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={onParagraphEditorStateChange}
              placeholder={`Type your learn material (paragraph #${number}) here...`}
            />
          </Grid>

          <Grid item xs={12} container alignItems="flex-start" justify="flex-end">
            <Button variant="contained" color="secondary" onClick={onParagraphRemove}>
              Remove
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

QuizParagraphEditor.propTypes = {
  classes: PropTypes.any,
  paragraph: PropTypes.any,
  onParagraphEditorStateChange: PropTypes.func,
  onParagraphRemove: PropTypes.func,
};

const mapStateToProps = (state, { id }) => ({ ...state.editingQuiz.paragraphs.byId[id] });

const mapDispatchToProps = (dispatch, { id }) => ({
  onParagraphEditorStateChange: (state) => {
    dispatch(changeParagraphEditorStateInEditingQuiz(id, state));
  },

  onParagraphRemove: () => {
    dispatch(removeParagraphFromEditingQuiz(id));
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizParagraphEditor));
