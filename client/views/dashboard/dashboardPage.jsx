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
import { quizzesSubscription, teamsSubscription } from '../../subscriptions';
import EmptyState from '../../components/emptyState';

class DashboardPage extends React.PureComponent {
  render() {
    const {
      classes,
      quizzes,
      invitedTeams,
      activeTeams,
      quizzesSubscriptionReady,
      teamsSubscriptionReady,
    } = this.props;

    if (!quizzesSubscriptionReady || !teamsSubscriptionReady) {
      return <div />;
    }

    if (activeTeams.length === 0 && invitedTeams.length === 0) {
      return (
        <EmptyState
          title="You have no any quizzes and teams yet."
          description={'Ask another users to send an invitation to you or create your own team'
          + ' to have ability to create or pass quizzes.'}
        />
      );
    }

    return (
      <div>
        {activeTeams.length === 0 && (
          <Grid container spacing={24}>
            <Grid item xs>
              <EmptyState
                title="You have no any quizzes yet."
                description={'Accept an invitation or create your own team to have ability'
                + ' to create or pass quizzes.'}
              />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={24}>
          {invitedTeams.map(({ _id: teamId }) => (
            <Grid item key={teamId} xs={12} sm={6} md={3}>
              <TeamTile teamId={teamId} />
            </Grid>
          ))}
        </Grid>

        {activeTeams.map(team => (
          <Grid key={team._id} container spacing={24}>
            <Grid item xs={12} className={classes.team}>
              <Paper elevation={1}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Typography
                      variant="title"
                      className={classes.teamTitle}
                    >
                      {team.title}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} container>
                    {quizzes
                      .filter(({ teamId }) => teamId === team._id)
                      .map(({ _id: quizId }) => (
                        <Grid key={quizId} item xs={12} sm={12} md={6} lg={4} xl={3}>
                          <div className={classes.quizTile}>
                            <QuizTileContainer
                              quizId={quizId}
                            />
                          </div>
                        </Grid>
                      ))}
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      className={classes.newQuizButton}
                      pt={12}
                      color="primary"
                      component={Link}
                      to={`/quiz-edit?team=${team._id}`}
                    >
                      Add a new quiz
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
  quizzesSubscriptionReady: PropTypes.bool.isRequired,
  teamsSubscriptionReady: PropTypes.bool.isRequired,
  quizzes: PropTypes.array.isRequired,
  invitedTeams: PropTypes.array.isRequired,
  activeTeams: PropTypes.array.isRequired,
};

export default compose(
  withTracker(() => {
    const quizzesSubscriptionReady = quizzesSubscription.ready();

    const teamsSubscriptionReady = teamsSubscription.ready();

    const quizzes = Quizzes
      .find()
      .fetch();

    const invitedTeams = Teams
      .findTeamsWithUserInvitedState(Meteor.userId())
      .fetch();

    const activeTeams = Teams
      .findTeamsWithUserActiveState(Meteor.userId())
      .fetch();

    return {
      quizzesSubscriptionReady,
      teamsSubscriptionReady,
      quizzes,
      invitedTeams,
      activeTeams,
    };
  }),

  withStyles(dashboardStyle),
)(DashboardPage);
