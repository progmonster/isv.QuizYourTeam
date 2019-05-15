import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Grid from '@material-ui/core/Grid';
import dashboardStyle from './dashboardStyle';
import QuizTileContainer from '../quizzes/quizTile';
import { Quizzes } from '../../../model/collections';

class DashboardPage extends React.PureComponent {
  render() {
    const { classes, quizzes } = this.props;

    return (
      <div>
        <Grid container>
          {quizzes.map(({ _id: quizId }) => (
            <Grid item key={quizId} xs={12} sm={6} md={3}>
              <QuizTileContainer quizId={quizId} />
            </Grid>
          ))}
        </Grid>
        {/* todo replace url with something like "/quizzes/new". Use /quizzes/:id/edit for edit exists */}
        <Fab color="primary" className={classes.addCardFab} component={Link} to="/quiz-edit">
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DashboardContainer = withTracker(() => ({
  quizzes: Quizzes.find()
    .fetch(),
}))(withStyles(dashboardStyle)(DashboardPage));


export default DashboardContainer;
