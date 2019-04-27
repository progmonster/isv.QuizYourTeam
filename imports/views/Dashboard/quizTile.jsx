import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AccessTime from "@material-ui/icons/AccessTime";
import Card from "/imports/components/Card/Card.jsx";
import CardHeader from "/imports/components/Card/CardHeader.jsx";
import CardBody from "/imports/components/Card/CardBody.jsx";
import CardFooter from "/imports/components/Card/CardFooter.jsx";
import PropTypes from "prop-types";
import dashboardStyle from "/imports/views/Dashboard/dashboardStyle.jsx";
import { withTracker } from "meteor/react-meteor-data";
import { Quizzes } from "../../collections";

class QuizTile extends React.PureComponent {
  render() {
    const { classes, quiz } = this.props;

    return (
      <Card>
        <CardHeader color="warning">
          <h4 className={classes.cardTitleWhite}>{quiz.title}</h4>
        </CardHeader>
        <CardBody>
          <p className={classes.cardCategory}>
            Test yourself and get a gift!
          </p>
        </CardBody>
        <CardFooter chart>
          <div className={classes.stats}>
            <AccessTime /> updated 4 minutes ago
          </div>
        </CardFooter>
      </Card>
    );
  }
}

QuizTile.propTypes = {
  classes: PropTypes.object.isRequired
};

const QuizTileContainer = withTracker(({ quizId }) => {
  return {
    quiz: Quizzes.findOne(quizId)
  };
})(withStyles(dashboardStyle)(QuizTile));



export default QuizTileContainer;

