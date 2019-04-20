import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import { Editor } from 'react-draft-wysiwyg';
import Paper from "@material-ui/core/Paper";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import QuizAnswersEditor from "./QuizAnswersEditor";

const styles = (theme) => ({
  quizQuestionEditor: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,/*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
});

class QuizQuestionEditor extends Component {
  render() {
    const { classes } = this.props;

    return <Paper className={classes.quizQuestionEditor} elevation={1}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h5" component="h3">
            Question #{this.props.number}
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Editor
            editorState={this.props.question.editorState}
            wrapperClassName="demo-wrapper"/*todo remove these class*/
            editorClassName="demo-editor"
            onEditorStateChange={(editorState) => this.props.onQuestionEditorStateChange(this.props.number, editorState)}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h5" component="h3">
            Answers
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <QuizAnswersEditor
            answers={this.props.question.answers}
            onAnswerAdd={(title, checked) => this.props.onAnswerAdd(this.props.number, title, checked)}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <Button variant="contained" color="secondary" onClick={() => this.props.onQuestionRemove(this.props.number)}>
            Remove question
          </Button>
        </GridItem>
      </GridContainer>
    </Paper>;
  }
}

QuizQuestionEditor.propTypes = {
  classes: PropTypes.any,
  question: PropTypes.any,
  onQuestionEditorStateChange: PropTypes.func,
  onQuestionRemove: PropTypes.func,
  onAnswerAdd: PropTypes.func,
};

export default withStyles(styles)(QuizQuestionEditor);