import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core';
import dashboardStyle from './dashboardStyle';
import { Quizzes, Teams } from '../../../model/collections';
import QuizTileContainer from '../quizzes/quizTile';
import TeamTile from '../teams/teamTile';

class DashboardPage extends React.PureComponent {
  render() {
    const { classes, quizzes, invitedTeams, activeTeams } = this.props;

    return (
      <div>
        <Grid container spacing={24}>
          {invitedTeams.map(({ _id: teamId }) => (
            <Grid item key={teamId} xs={12} sm={6} md={3}>
              <TeamTile teamId={teamId} />
            </Grid>
          ))}
        </Grid>

        {activeTeams.map(team => (
          <Grid key={team._id} container spacing={24}>
            <Grid item xs={12}>
              <Paper>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>{team.title}</Typography>
                  </Grid>

                  <Grid item xs={12} container spacing={24}>
                    {quizzes
                      .filter(({ teamId }) => teamId === team._id)
                      .map(({ _id: quizId }) => (
                        <Grid key={quizId} item xs={12} sm={6} md={3}>
                          <QuizTileContainer quizId={quizId} />
                        </Grid>
                      ))}
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      component={Link}
                      to={`/quiz-edit?team=${team._id}`}
                    >
                      Add new quiz
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        ))}
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

    invitedTeams: Teams.findTeamsWithUserInvitedState(Meteor.userId())
      .fetch(),

    activeTeams: Teams.findTeamsWithUserActiveState(Meteor.userId())
      .fetch(),
  })),

  withStyles(dashboardStyle),
)(DashboardPage);
