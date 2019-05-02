import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import { changeParagraphEditorStateInEditingQuiz } from "/imports/actions";
import { connect } from "react-redux";
import { removeParagraphFromEditingQuiz } from "../../actions";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
  cardCategoryWhite: {/*todo remove?*/
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {/*todo remove?*/
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  quizParagraphEditor: {
    ...theme.mixins.gutters(), /*todo why?*/
    paddingTop: theme.spacing.unit * 2, /*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
});

class QuizParagraphEditor extends React.PureComponent {
  render() {
    const { number, editorState, onParagraphEditorStateChange, onParagraphRemove, classes } = this.props;

    return <Paper className={classes.quizParagraphEditor} elevation={1}>
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="h5" component="h3">
            Paragraph #{number}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onParagraphEditorStateChange}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="secondary" onClick={onParagraphRemove}>
            Remove paragraph
          </Button>
        </Grid>
      </Grid>
    </Paper>;
  }
}

QuizParagraphEditor.propTypes = {
  classes: PropTypes.any,
  paragraph: PropTypes.any,
  onParagraphEditorStateChange: PropTypes.func,
  onParagraphRemove: PropTypes.func,
};

const mapStateToProps = (state, { id }) => {
  return { ...state.editingQuiz.paragraphs.byId[id] };
};

const mapDispatchToProps = (dispatch, { id }) => {
  return {
    onParagraphEditorStateChange: (state) => {
      dispatch(changeParagraphEditorStateInEditingQuiz(id, state));
    },

    onParagraphRemove: () => {
      dispatch(removeParagraphFromEditingQuiz(id));
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizParagraphEditor));