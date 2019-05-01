import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "/imports/components/Card/Card.jsx";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Quizzes } from "../../collections";
import IconButton from "@material-ui/core/IconButton";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Delete, Edit } from "@material-ui/icons";
import CardHeader from "@material-ui/core/CardHeader";
import { orange } from "@material-ui/core/colors";
import AlertDialog from "../../components/alertDialog";
import { removeQuiz } from "../../actions";
import { connect } from "react-redux";

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

    return (
      <Card>
        <CardHeader
          classes={{ root: classes.headerRoot, title: classes.headerTitle }}
          title={quiz.title}
        />

        <CardContent>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>

        <CardActions>
          <Button size="small" color="primary">
            Learn
          </Button>

          <Button size="small" color="primary">
            Quiz
          </Button>

          <IconButton>
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
    onQuizRemove: () => {
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

