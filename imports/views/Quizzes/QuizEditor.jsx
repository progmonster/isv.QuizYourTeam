import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Editor } from 'react-draft-wysiwyg';
import Button from "@material-ui/core/Button";
import QuizQuestionEditor from "./QuizQuestionEditor";
import QuizParagraphEditor from "./QuizParagraphEditor";
import { connect } from "react-redux";
import { addParagraphToEditingQuiz, addQuestionToEditingQuiz, setEditingQuiz } from "/imports/actions";
import * as PropTypes from "prop-types";
import {
  changeDescriptionEditorStateInEditingQuiz,
  changeTitleInEditingQuiz,
  clearEditingQuiz,
  saveEditingQuiz
} from "../../actions";
import TextField from "@material-ui/core/TextField";
import { compose } from "redux";
import { Quizzes } from "../../collections";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { orange } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";

const styles = {
  quizEditorCardHeaderRoot: {
    backgroundColor: orange[500],
  },

  quizEditorCardHeaderTitle: {
    color: "white",
  },

  quizEditorCardSubheaderTitle: {
    color: "white",
  },
};

class QuizEditor extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.isNewQuiz = !QuizEditor.getQuizId(props);

    this.quizSubscription = null;

    this.state = {
      originalTitle: null,
      quizLoaded: this.isNewQuiz
    }
  }

  static getQuizId = (props) => props.match.params.quizId;

  componentDidMount() {
    const quizId = QuizEditor.getQuizId(this.props);

    this.props.dispatch(clearEditingQuiz());

    if (!this.isNewQuiz) {
      this.quizSubscription = Meteor.subscribe("quiz", quizId);

      Tracker.autorun((computation) => {
        if (this.quizSubscription) {
          const quizLoaded = this.quizSubscription.ready();

          if (!quizLoaded) {
            this.setState({ originalTitle: null })
          } else {
            const quiz = Quizzes.findOne(quizId);

            this.props.dispatch(setEditingQuiz(quiz));

            this.setState({ originalTitle: quiz.title })
          }

          this.setState({ quizLoaded });
        } else {
          computation.stop();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.quizSubscription) {
      this.quizSubscription.stop();

      this.quizSubscription = null;
    }
  }

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
      <Grid container justify="space-around">
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardHeader
              classes={{
                root: classes.quizEditorCardHeaderRoot,
                title: classes.quizEditorCardHeaderTitle,
                subheader: classes.quizEditorCardSubheaderTitle
              }}

              title={this.isNewQuiz ? "New Quiz" : "Edit Quiz"}

              subheader={
                !this.isNewQuiz && this.state.originalTitle
                  ? `You are editing '${this.state.originalTitle}' quiz`
                  : null
              }
            />

            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Editor
                    editorState={descriptionEditorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={onDescriptionEditorStateChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {paragraphs.allIds.map((id, idx) =>
          (<Grid item key={id} xs={12} sm={12} md={8}>
            <QuizParagraphEditor id={id} number={idx + 1} />
          </Grid>)
        )}

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={onParagraphCreate}>
            Add new paragraph
          </Button>
        </Grid>

        {questions.allIds.map((id, idx) =>
          (<Grid item key={idx} xs={12} sm={12} md={8}>
            <QuizQuestionEditor id={id} number={idx + 1} />
          </Grid>)
        )}

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={onQuestionCreate}>
            Add new question
          </Button>
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={onQuizSave}>
            Save Quiz
          </Button>
        </Grid>
      </Grid>
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

const mapDispatchToProps = (dispatch, { history }) => {
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

    dispatch
  }
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(QuizEditor);
