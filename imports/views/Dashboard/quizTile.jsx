import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { withTracker } from "meteor/react-meteor-data";
import { Quizzes } from "../../collections";
import IconButton from "@material-ui/core/IconButton";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { Delete, Edit } from "@material-ui/icons";
import CardHeader from "@material-ui/core/CardHeader";
import { orange } from "@material-ui/core/colors";
import AlertDialog from "../../components/alertDialog";
import { removeQuiz } from "../../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";

const styles = theme => ({
  headerRoot: {
    backgroundColor: orange[500],
  },

  headerTitle: {
    color: "white",
    fontSize: 16,
  }
});

class QuizTile extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      removeConfirmationOpened: false
    };
  }

  handleRemoveConfirmationClosed = (confirmed) => {
    this.setState({ removeConfirmationOpened: false });

    if (confirmed) {
      this.props.onQuizRemove();
    }
  };

  render() {
    const { classes, quiz } = this.props;

    const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

    return (
      <Card>
        <CardHeader
          classes={{ root: classes.headerRoot, title: classes.headerTitle }}
          title={quiz.title}
        />

        <CardContent dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }} />

        <CardActions>
          <Button size="small" color="primary">
            Learn
          </Button>

          <Button size="small" color="primary">
            Quiz
          </Button>

          <IconButton component={Link} to={`/quiz-edit/${quiz._id}`}>
            <Edit />
          </IconButton>

          <IconButton color="secondary" onClick={() => this.setState({ removeConfirmationOpened: true })}>
            <Delete />
          </IconButton>
        </CardActions>

        {/*
        todo optimize. Probably via single AlertDialog that controlled via redux actions.
        */}
        <AlertDialog
          open={this.state.removeConfirmationOpened}
          title={"Remove the quiz?"}
          contentText={""}
          okText={"Remove"}
          cancelText={"Cancel"}
          handleClose={this.handleRemoveConfirmationClosed}
        />
      </Card>
    );
  }
}

QuizTile.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = (dispatch, { quizId }) => {
  return {
    onQuizRemove() {
      dispatch(removeQuiz(quizId));
    },
  }
};

const QuizTileContainer = withTracker(({ quizId }) => {
  return {
    quiz: Quizzes.findOne(quizId)
  };
})(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizTile)));


export default QuizTileContainer;

