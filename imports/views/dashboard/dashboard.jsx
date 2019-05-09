import React from "react";
import PropTypes from "prop-types";
import { Editor } from 'react-draft-wysiwyg';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';//todo check it (all occurrences)
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "./dashboardStyle.jsx";
import { Link } from "react-router-dom";
import QuizTileContainer from "./quizTile";
import { withTracker } from "meteor/react-meteor-data";
import { Quizzes } from "../../collections";
import Grid from "@material-ui/core/Grid";

class Dashboard extends React.PureComponent {
  render() {
    const { classes, quizzes } = this.props;

    return (
      <div>
        <Grid container>
          {quizzes.map(({ _id: quizId }) => {
            return (<Grid item key={quizId} xs={12} sm={6} md={3}>
              <QuizTileContainer quizId={quizId} />
            </Grid>);
          })}
        </Grid>
        {/*todo replace url with something like "/quizzes/new". Use /quizzes/:id/edit for edit exists */}
        <Fab color="primary" className={classes.addCardFab} component={Link} to="/quiz-edit">
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const DashboardContainer = withTracker(() => {
  return {
    quizzes: Quizzes.find().fetch()
  };
})(withStyles(dashboardStyle)(Dashboard));


export default DashboardContainer;
