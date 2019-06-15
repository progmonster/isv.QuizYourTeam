import { Meteor } from 'meteor/meteor';
import React from 'react';
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { withTracker } from 'meteor/react-meteor-data';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Delete, Edit } from '@material-ui/icons';
import CardHeader from '@material-ui/core/CardHeader';
import { green, orange } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import { Roles } from 'meteor/alanning:roles';
import { removeQuiz } from '../../services/actions';
import AlertDialog from '../../components/alertDialog';
import { Quizzes } from '../../../model/collections';
import { MAX_POSSIBLE_RESULT } from '../../../model/quiz';
import moment from 'moment';
import { compose } from 'redux';

const styles = theme => ({
  headerRoot: {
    backgroundColor: orange[500],
  },

  headerRoot_passedQuiz: {
    backgroundColor: green[500],
  },

  headerTitle: {
    color: 'white',
    fontSize: 16,
  },

  headerIcon: {
    color: 'white',
  },

  headerContent: {
    wordWrap: 'break-word',
    minWidth: 0,
  },

  content: {
    wordWrap: 'break-word',
  },

  resultsBlock: {
    wordWrap: 'break-word',
    fontStyle: 'italic',
  },

  yourScoreNote: {
    color: green[500],
  },
});

class QuizTile extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      removeConfirmationOpened: false,
    };
  }

  handleRemoveConfirmationClosed = (confirmed) => {
    this.setState({ removeConfirmationOpened: false });

    if (confirmed) {
      this.props.onQuizRemove();
    }
  };

  render() {
    const { classes, quiz, roles, currentUserId } = this.props;

    if (!quiz) {
      return <div />;
    }

    const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

    const currentUserPassResult = quiz.getPassInfoByUserId(currentUserId);

    return (
      <Card elevation={1}>
        <CardHeader
          classes={{
            root: currentUserPassResult ? classes.headerRoot_passedQuiz : classes.headerRoot,
            title: classes.headerTitle,
            content: classes.headerContent,
          }}
          avatar={<FormatAlignLeft className={classes.headerIcon} />}
          title={quiz.title}
        />

        <CardContent>
          <span
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }}
          />
        </CardContent>

        <CardContent className={classes.resultsBlock}>
          <p>
            Creator:&nbsp;
            <span>{quiz.creator.fullName || quiz.creator.email}</span>
          </p>

          <p>
            Updated:&nbsp;
            <span>{moment(quiz.updatedAt)
              .fromNow()}</span>
          </p>

          <p>
            Passed users:&nbsp;
            <span>{quiz.getPassedUsersCount()}</span>
          </p>

          {quiz.getPassedUsersCount() > 0 && (
            <p>
              Average score:&nbsp;
              <span>{quiz.getAverageScore()}</span>
              &nbsp;from&nbsp;
              <span>{MAX_POSSIBLE_RESULT}</span>
            </p>
          )}

          {currentUserPassResult && (
            <p className={classes.yourScoreNote}>
              Your score:&nbsp;
              <span>{currentUserPassResult.result}</span>
              &nbsp;from&nbsp;
              <span>{MAX_POSSIBLE_RESULT}</span>
            </p>
          )}
        </CardContent>

        <CardActions>
          <Button size="small" color="primary" component={Link} to={`/quiz-learn/${quiz._id}`}>
            Learn
          </Button>

          {roles.passQuiz && (
            <Button size="small" color="primary" component={Link} to={`/quiz-pass/${quiz._id}`}>
              Quiz
            </Button>
          )}

          {roles.editQuiz && (
            <IconButton component={Link} to={`/quiz-edit/${quiz._id}`}>
              <Edit />
            </IconButton>
          )}

          {roles.removeQuiz && (
            <IconButton color="secondary"
                        onClick={() => this.setState({ removeConfirmationOpened: true })}>
              <Delete />
            </IconButton>
          )}
        </CardActions>

        {/*
         todo optimize. Probably via single AlertDialog that controlled via redux actions.
         */}
        <AlertDialog
          open={this.state.removeConfirmationOpened}
          title="Remove the quiz?"
          contentText=""
          okText="Remove"
          cancelText="Cancel"
          handleClose={this.handleRemoveConfirmationClosed}
        />
      </Card>
    );
  }
}

QuizTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, { quizId }) => ({
  onQuizRemove() {
    dispatch(removeQuiz(quizId));
  },
});

export default compose(
  withTracker(({ quizId }) => ({
    quiz: Quizzes.findOne(quizId),

    currentUserId: Meteor.userId(),

    roles: {
      editQuiz: Roles.userIsInRole(Meteor.userId(), 'editQuiz', `quizzes/${quizId}`),
      removeQuiz: Roles.userIsInRole(Meteor.userId(), 'removeQuiz', `quizzes/${quizId}`),
      passQuiz: Roles.userIsInRole(Meteor.userId(), 'passQuiz', `quizzes/${quizId}`),
    },
  })),

  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(QuizTile);
