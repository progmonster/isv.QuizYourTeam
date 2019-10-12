import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { parse as parseQueryString } from 'query-string';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { orange } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import { Quizzes } from '../../../model/collections';
import QuizQuestionEditor from './quizQuestionEditor';
import QuizParagraphEditor from './quizParagraphEditor';
import {
  addParagraphToEditingQuiz,
  addQuestionToEditingQuiz,
  changeDescriptionEditorStateInEditingQuiz,
  changeTitleInEditingQuiz,
  clearEditingQuiz,
  saveEditingQuiz,
  setEditingQuiz,
} from '../../services/actions';

const styles = {
  quizEditorCardHeaderRoot: {
    backgroundColor: orange[500],
  },

  quizEditorCardHeaderTitle: {
    color: 'white',
  },

  quizEditorCardSubheaderTitle: {
    color: 'white',
  },

  paragraph: {
    marginTop: '2em',
  },

  addNewParagraphBlock: {
    marginTop: '0.5em',
  },

  questionsStartBlock: {
    marginTop: '2em',
  },

  question: {
    marginTop: '2em',
  },

  addNewQuestionBlock: {
    marginTop: '0.5em',
  },

  saveQuizStartBlock: {
    marginTop: '3em',
  },
};

class QuizEditorPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.isNewQuiz = !QuizEditorPage.getQuizId(props);

    this.quizSubscription = null;

    this.state = {
      originalTitle: null,
      quizLoaded: this.isNewQuiz,
    };
  }

  static getQuizId = props => props.match.params.quizId;

  getTeamId = () => parseQueryString(this.props.location.search);

  componentDidMount() {
    const quizId = QuizEditorPage.getQuizId(this.props);

    const {
      dispatch,
    } = this.props;

    dispatch(clearEditingQuiz());

    if (!this.isNewQuiz) {
      this.quizSubscription = Meteor.subscribe('quiz', quizId);

      Tracker.autorun((computation) => {
        if (this.quizSubscription) {
          const quizLoaded = this.quizSubscription.ready();

          if (!quizLoaded) {
            this.setState({ originalTitle: null });
          } else {
            const quiz = Quizzes.findOne(quizId);

            dispatch(setEditingQuiz(quiz));

            this.setState({ originalTitle: quiz.title });
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
      onQuizSave,
    } = this.props;

    const {
      quizLoaded,
      originalTitle,
    } = this.state;

    if (!quizLoaded) {
      return <div />;
    }

    return (
      <Grid container justify="space-around">
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              classes={{
                root: classes.quizEditorCardHeaderRoot,
                title: classes.quizEditorCardHeaderTitle,
                subheader: classes.quizEditorCardSubheaderTitle,
              }}

              title={this.isNewQuiz ? 'New Quiz' : 'Edit Quiz'}

              subheader={
                !this.isNewQuiz && originalTitle
                  ? `You are editing '${originalTitle}' quiz`
                  : null
              }
            />

            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    value={title}
                    onChange={event => onTitleChange(event.target.value)}
                    margin="normal"
                    fullWidth
                    placeholder="Type your quiz title here..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Editor
                    placeholder="Type your quiz description here..."
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

        {paragraphs.allIds.map((id, idx) => (
          <Grid item key={id} xs={12} md={8} className={classes.paragraph}>
            <QuizParagraphEditor id={id} number={idx + 1} />
          </Grid>
        ))}

        <Grid item xs={12} md={8} className={classes.addNewParagraphBlock}>
          <Button variant="contained" color="primary" onClick={onParagraphCreate}>
            Add a new paragraph
          </Button>
        </Grid>

        <Grid item xs={12} className={classes.questionsStartBlock} />

        {questions.allIds.map((id, idx) => (
          <Grid item key={id} xs={12} md={8} className={classes.question}>
            <QuizQuestionEditor id={id} number={idx + 1} />
          </Grid>
        ))}

        <Grid item xs={12} md={8} className={classes.addNewQuestionBlock}>
          <Button variant="contained" color="primary" onClick={onQuestionCreate}>
            Add a new question
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
          className={classes.saveQuizStartBlock}
          container
          alignItems="flex-start"
          justify="flex-end"
          direction="row"
        >
          <Button variant="contained" color="primary" onClick={onQuizSave}>
            Save Quiz
          </Button>
        </Grid>
      </Grid>
    );
  }
}

QuizEditorPage.propTypes = {
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

const mapStateToProps = state => ({
  title: state.editingQuiz.title,
  descriptionEditorState: state.editingQuiz.descriptionEditorState,
  paragraphs: state.editingQuiz.paragraphs,
  questions: state.editingQuiz.questions,
});

const mapDispatchToProps = (dispatch, { location: { search } }) => ({
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
    const teamId = parseQueryString(search).team;

    dispatch(saveEditingQuiz(teamId));
  },

  dispatch,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(QuizEditorPage);
