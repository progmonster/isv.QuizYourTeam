import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import Paper from "@material-ui/core/Paper";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import QuizAnswersEditor from "./QuizAnswersEditor";
import { connect } from "react-redux";
import { changeQuestionEditorStateInEditingQuiz, removeQuestionFromEditingQuiz } from "../../actions";

const styles = (theme) => ({
  quizQuestionEditor: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,/*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
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

    return <Paper className={classes.quizQuestionEditor} elevation={1}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h5" component="h3">
            Question #{questionNumber}
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"/*todo remove these class*/
            editorClassName="demo-editor"
            onEditorStateChange={onQuestionEditorStateChange}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h5" component="h3">
            Answers
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <QuizAnswersEditor questionId={questionId} />
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <Button variant="contained" color="secondary" onClick={onQuestionRemove}>
            Remove question
          </Button>
        </GridItem>
      </GridContainer>
    </Paper>;
  }
}

QuizQuestionEditor.propTypes = {
  classes: PropTypes.any,
  id: PropTypes.number,
  number: PropTypes.number,
  onQuestionEditorStateChange: PropTypes.func,
  onQuestionRemove: PropTypes.func,
};

const mapStateToProps = (state, { id }) => {
  return { ...state.editingQuiz.questions.byId[id] };
};

const mapDispatchToProps = (dispatch, { id: questionId }) => {
  return {
    onQuestionEditorStateChange: (state) => {
      dispatch(changeQuestionEditorStateInEditingQuiz(questionId, state));
    },

    onQuestionRemove: () => {
      dispatch(removeQuestionFromEditingQuiz(questionId));
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizQuestionEditor));
