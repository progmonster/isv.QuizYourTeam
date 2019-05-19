import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Grid from '@material-ui/core/Grid';
import dashboardStyle from './dashboardStyle';
import QuizTileContainer from '../quizzes/quizTile';
import { Quizzes, Teams } from '../../../model/collections';
import TeamTile from '../teams/teamTile';

class DashboardPage extends React.PureComponent {
  render() {
    const { classes, quizzes, invitedTeams } = this.props;

    return (
      <div>
        <Grid container spacing={24}>
          {invitedTeams.map(({ _id: teamId }) => (
            <Grid item key={teamId} xs={12} sm={6} md={3}>
              <TeamTile teamId={teamId} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={24}>
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

export default compose(
  withTracker(() => ({
    quizzes: Quizzes.find()
      .fetch(),

    invitedTeams: Teams.findWithInvitedUser(Meteor.userId())
      .fetch(),
  })),

  withStyles(dashboardStyle),
)(DashboardPage);
