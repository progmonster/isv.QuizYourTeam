import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import { Roles } from 'meteor/alanning:roles';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Teams } from '../../../model/collections';
import teamService from '../../services/teamService';
import { snackbarUtils } from '../../components/snackbar';
import { blue } from '@material-ui/core/colors';

const styles = theme => ({
  teamInfo: {
    wordWrap: 'break-word',
    fontStyle: 'italic',
  },

  invitedNote: {
    color: blue[500],
  },

  card: {
    maxWidth: 400,
  },

  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class TeamTile extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      expanded: false,
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const {
      classes,
      team,
      teamId,
      roles,
      currentUserId,
    } = this.props;

    const isUserInInvitedState = team.isUserInInvitedState(currentUserId);

    return (
      <Card className={classes.card} elevation={1}>
        <CardHeader
          title={team.title}
        />

        {isUserInInvitedState && (
          <CardContent className={classes.invitedNote}>
            You are invited to the team. Please accept or reject the invitation.
          </CardContent>
        )}

        {team.description && (
          <CardContent>
            {team.description}
          </CardContent>
        )}

        <CardContent className={classes.teamInfo}>
          <p>
            Creator:&nbsp;
            <span>{team.creator.fullName || team.creator.email}</span>
          </p>

          <p>
            Participants:&nbsp;
            <span>{team.getActiveParticipantCount()}</span>
          </p>

          {/* todo add quiz count */}
        </CardContent>

        <CardActions className={classes.actions} disableActionSpacing>
          {isUserInInvitedState ? this.renderInviteActions() : this.renderActiveTeamSettings()}
        </CardActions>
      </Card>
    );
  }

  renderInviteActions() {
    const {
      classes,
      onInvitationAccept,
      onInvitationReject,
    } = this.props;

    return (
      <Fragment>
        <Button
          variant="contained"
          color="secondary"
          onClick={onInvitationReject}
        >
          Reject
        </Button>

        &nbsp;

        <Button
          variant="contained"
          color="primary"
          onClick={onInvitationAccept}
        >
          Accept
        </Button>
      </Fragment>
    );
  }

  renderActiveTeamSettings() {
    const {
      classes, team, teamId, roles,
    } = this.props;

    return (
      <IconButton aria-label="Configure" component={Link} to={`/team-settings/${teamId}`}>
        <SettingsIcon />
      </IconButton>
    );
  }
}

TeamTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch, { team: { _id: teamId } }) => ({
  onInvitationAccept() {
    snackbarUtils.runAsyncWithNotificationAndErrorLog(
      dispatch,
      'The invitation has been accepted',
      error => `Error accepting the invitation: ${error.message}`,
      () => teamService.acceptInvitation(teamId),
    );
  },

  onInvitationReject() {
    snackbarUtils.runAsyncWithNotificationAndErrorLog(
      dispatch,
      'The invitation has been rejected',
      error => `Error rejecting the invitation: ${error.message}`,
      () => teamService.rejectInvitation(teamId),
    );
  },
});

export default compose(
  withTracker(({ teamId }) => {
    const team = Teams.findOne(teamId);

    return ({
      team,
      currentUserId: Meteor.userId(),

      roles: {
        /*
         editQuiz: Roles.userIsInRole(Meteor.userId(), "editQuiz", `quizzes/${quizId}`),
         removeQuiz: Roles.userIsInRole(Meteor.userId(), "removeQuiz", `quizzes/${quizId}`),
         passQuiz: Roles.userIsInRole(Meteor.userId(), "passQuiz", `quizzes/${quizId}`),
         */
      },
    });
  }),

  withStyles(styles),
  connect(null, mapDispatchToProps),
)(TeamTile);
