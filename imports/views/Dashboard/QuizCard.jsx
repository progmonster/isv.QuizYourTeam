import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AccessTime from "@material-ui/icons/AccessTime";
import Card from "/imports/components/Card/Card.jsx";
import CardHeader from "/imports/components/Card/CardHeader.jsx";
import CardIcon from "/imports/components/Card/CardIcon.jsx";
import CardBody from "/imports/components/Card/CardBody.jsx";
import CardFooter from "/imports/components/Card/CardFooter.jsx";
import PropTypes from "prop-types";
import dashboardStyle from "/imports/assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class QuizCard extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Card>
        <CardHeader color="warning">
          <h4 className={classes.cardTitleWhite}>Test Quiz</h4>
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

QuizCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(QuizCard);

