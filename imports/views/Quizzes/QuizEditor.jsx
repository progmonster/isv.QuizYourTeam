import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Editor } from 'react-draft-wysiwyg';
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Card from "/imports/components/Card/Card.jsx";
import CardHeader from "/imports/components/Card/CardHeader.jsx";
import CardBody from "/imports/components/Card/CardBody.jsx";
import CardFooter from "/imports/components/Card/CardFooter.jsx";
import Button from "@material-ui/core/Button";
import QuizQuestionEditor from "./QuizQuestionEditor";
import QuizParagraphEditor from "./QuizParagraphEditor";
import { connect } from "react-redux";
import { addParagraphToEditingQuiz, addQuestionToEditingQuiz } from "/imports/actions";
import * as PropTypes from "prop-types";
import { changeDescriptionEditorStateInEditingQuiz, changeTitleInEditingQuiz, saveEditingQuiz } from "../../actions";
import TextField from "@material-ui/core/TextField";

const styles = {
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
  }
};

class QuizEditor extends React.PureComponent {
  render() {
    const {
      classes,
      title,
      descriptionEditorState,
      paragraphs,
      onParagraphCreate,
      questions,
      onQuestionCreate,
      onTitleChange,
      onDescriptionEditorStateChange,
      onQuizSave
    } = this.props;

    return (
      <div>
        <GridContainer justify="space-around">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Quiz</h4>
                <p className={classes.cardCategoryWhite}>Complete your quiz</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      value={title}
                      onChange={(event) => onTitleChange(event.target.value)}
                      margin="normal"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <Editor
                      editorState={descriptionEditorState}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      onEditorStateChange={onDescriptionEditorStateChange}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </GridItem>

          {paragraphs.allIds.map((id, idx) =>
            (<GridItem key={id} xs={12} sm={12} md={8}>
              <QuizParagraphEditor id={id} number={idx + 1} />
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={onParagraphCreate}>
              Add new paragraph
            </Button>
          </GridItem>

          {questions.allIds.map((id, idx) =>
            (<GridItem key={idx} xs={12} sm={12} md={8}>
              <QuizQuestionEditor id={id} number={idx + 1} />
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={onQuestionCreate}>
              Add new question
            </Button>
          </GridItem>

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={onQuizSave}>
              Save quiz
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

QuizEditor.propTypes = {
  classes: PropTypes.any,
  title: PropTypes.string,
  paragraphs: PropTypes.any,
  questions: PropTypes.any,
  onParagraphCreate: PropTypes.func,
  onQuestionCreate: PropTypes.func,
  onTitleChange: PropTypes.func,
  onDescriptionEditorStateChange: PropTypes.func,
  onQuizSave: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    title: state.editingQuiz.title,
    descriptionEditorState: state.editingQuiz.descriptionEditorState,
    paragraphs: state.editingQuiz.paragraphs,
    questions: state.editingQuiz.questions,
  };
};

const mapDispatchToProps = (dispatch, {history}) => {
  return {
    onParagraphCreate: () => {
      dispatch(addParagraphToEditingQuiz());
    },

    onQuestionCreate: () => {
      dispatch(addQuestionToEditingQuiz());
    },

    onTitleChange: (title) => {
      dispatch(changeTitleInEditingQuiz(title));
    },

    onDescriptionEditorStateChange: (state) => {
      dispatch(changeDescriptionEditorStateInEditingQuiz(state));
    },

    onQuizSave: () => {
      dispatch(saveEditingQuiz(history));
    },
  }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizEditor));
