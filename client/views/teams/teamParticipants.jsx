import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import AlertDialog from '../../components/alertDialog';
import { withTracker } from 'meteor/react-meteor-data';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { INVITED } from '../../../model/participantStates';
import { snackbarActions as snackbar, snackbarUtils } from '../../components/snackbar';
import teamService from '../../services/teamService';
import blue from '@material-ui/core/colors/blue';

const styles = {
  participantTableRowRoot_currentUser: {
    fontWeight: 'bold',
  },

  participantTableRowRoot_invitedUser: {
    color: blue[700],
  },
};

function RegularParticipant(props) {
  const {
    participant,
    onParticipantRemove,
  } = props;

  return (
    <TableRow>
      <TableCell>{participant.email}</TableCell>
      <TableCell>{participant.fullName}</TableCell>
      <TableCell>Active</TableCell>

      <TableCell align="right">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onParticipantRemove}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}

function InvitedParticipant(props) {
  const {
    classes,
    participant,
    onInvitationCancel,
    onInvitationResend,
  } = props;

  return (
    <TableRow>
      <TableCell classes={{ root: classes.participantTableRowRoot_invitedUser }}>
        {participant.email}
      </TableCell>

      <TableCell>{participant.fullName}</TableCell>
      <TableCell>Invited</TableCell>

      <TableCell align="right">
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={onInvitationResend}
        >
          Resend invitation
        </Button>

        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onInvitationCancel}
        >
          Cancel invitation
        </Button>
      </TableCell>
    </TableRow>
  );
}

function YouAsParticipant(props) {
  const {
    classes,
    participant,
  } = props;

  return (
    <TableRow>
      <TableCell classes={{ root: classes.participantTableRowRoot_currentUser }}>
        {`${participant.email} (you)`}
      </TableCell>

      <TableCell>{participant.fullName}</TableCell>
      <TableCell>Active</TableCell>
      <TableCell align="right" />
    </TableRow>
  );
}

class TeamParticipants extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      participantToBeRemoved: null,
      removeParticipantConfirmationOpened: false,

      invitationToBeResend: null,
      resendInvitationConfirmationOpened: false,

      invitationToBeCanceled: null,
      cancelInvitationConfirmationOpened: false,

      personEmail: '',
    };
  }

  onRemoveParticipantConfirmationOpen = (participant) => {
    this.setState({
      participantToBeRemoved: participant,
      removeParticipantConfirmationOpened: true,
    });
  };

  onRemoveParticipantConfirmationClose = (confirmed) => {
    const participant = this.state.participantToBeRemoved;

    this.setState({
      participantToBeRemoved: null,
      removeParticipantConfirmationOpened: false,
    });

    const {
      onParticipantRemove,
    } = this.props;

    if (confirmed) {
      onParticipantRemove(participant);
    }
  };

  onResendInvitationConfirmationOpen = (participant) => {
    this.setState({
      invitationToBeResend: participant,
      resendInvitationConfirmationOpened: true,
    });
  };

  onResendInvitationConfirmationClose = (confirmed) => {
    const participant = this.state.invitationToBeResend;

    this.setState({
      invitationToBeResend: null,
      resendInvitationConfirmationOpened: false,
    });

    const {
      onInvitationResend,
    } = this.props;

    if (confirmed) {
      onInvitationResend(participant);
    }
  };

  onCancelInvitationConfirmationOpen = (participant) => {
    this.setState({
      invitationToBeCanceled: participant,
      cancelInvitationConfirmationOpened: true,
    });
  };

  onCancelInvitationConfirmationClose = (confirmed) => {
    const participant = this.state.invitationToBeCanceled;

    this.setState({
      invitationToBeCanceled: null,
      cancelInvitationConfirmationOpened: false,
    });

    const {
      onInvitationCancel,
    } = this.props;

    if (confirmed) {
      onInvitationCancel(participant);
    }
  };

  onPersonEmailChange = (personEmail) => {
    this.setState({ personEmail });
  };

  renderParticipantRow = (participant) => {
    const participantId = participant._id;

    const { currentUserId, classes } = this.props;

    if (participant._id === currentUserId) {
      return (
        <YouAsParticipant
          key={participantId}
          participant={participant}
          classes={classes}
        />
      );
    }

    if (participant.state === INVITED) {
      return (
        <InvitedParticipant
          key={participantId}
          participant={participant}
          classes={classes}
          onInvitationResend={() => this.onResendInvitationConfirmationOpen(participant)}
          onInvitationCancel={() => this.onCancelInvitationConfirmationOpen(participant)}
        />
      );
    }

    return (
      <RegularParticipant
        key={participantId}
        participant={participant}
        classes={classes}
        onParticipantRemove={() => this.onRemoveParticipantConfirmationOpen(participant)}
      />
    );
  };

  render() {
    const {
      classes,
      team,
      currentUserId,
      onPersonInvite,
    } = this.props;

    const {
      removeParticipantConfirmationOpened,
      resendInvitationConfirmationOpened,
      cancelInvitationConfirmationOpened,
      personEmail,
    } = this.state;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(team.participants)
              .map(this.renderParticipantRow)}
          </TableBody>
        </Table>

        <AlertDialog
          open={removeParticipantConfirmationOpened}
          title="Remove the team participant?"
          contentText=""
          okText="Remove"
          cancelText="Cancel"
          handleClose={this.onRemoveParticipantConfirmationClose}
        />

        <AlertDialog
          open={resendInvitationConfirmationOpened}
          title="Resend the invitation?"
          contentText=""
          okText="Resend"
          cancelText="Close"
          handleClose={this.onResendInvitationConfirmationClose}
        />

        <AlertDialog
          open={cancelInvitationConfirmationOpened}
          title="Cancel participant invitation?"
          contentText=""
          okText="Cancel invitation"
          cancelText="Close"
          handleClose={this.onCancelInvitationConfirmationClose}
        />

        <Grid item xs={12} sm={12} md={8}>
          <TextField
            label="User Email"
            value={personEmail}
            onChange={event => this.onPersonEmailChange(event.target.value)}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => onPersonInvite(personEmail.trim())}
          >
            Invite an user
          </Button>
        </Grid>
      </Paper>
    );
  }
}

TeamParticipants.propTypes = {
  /*
    classes: PropTypes.shape({
      teamSettingsCardSubheaderTitle: PropTypes.string.isRequired,
      teamSettingsCardHeaderTitle: PropTypes.string.isRequired,
      teamSettingsCardHeaderRoot: PropTypes.string.isRequired,
    }).isRequired,

    teamLoaded: PropTypes.bool.isRequired,
    isNewTeam: PropTypes.bool.isRequired,
    team: PropTypes.instanceOf(Team),
    onTeamSave: PropTypes.func.isRequired,
    onTeamRemove: PropTypes.func.isRequired,
  */
};

TeamParticipants.defaultProps = {
//  team: null,
};

const mapDispatchToProps = (dispatch, { team: { _id: teamId } }) => ({
  async onPersonInvite(personEmail) {
    try {
      await teamService.invitePersonByEmail(teamId, personEmail);

      dispatch(snackbar.show({ message: 'The invitation has been sent' }));
    } catch (error) {
      dispatch(snackbar.show({ message: `Error sending the invitation: ${error.message}` }));
    }
  },

  onParticipantRemove(participant) {
    snackbarUtils.runAsyncWithNotification(
      dispatch,
      'The has been removed',
      error => `Error removal the participant: ${error.message}`,
      () => teamService.removeParticipant(teamId, participant._id),
    );
  },

  onInvitationCancel(participant) {
    snackbarUtils.runAsyncWithNotification(
      dispatch,
      'The invitation has been canceled',
      error => `Error cancelling the invitation: ${error.message}`,
      () => teamService.cancelInvitation(teamId, participant._id),
    );
  },

  onInvitationResend(participant) {
    snackbarUtils.runAsyncWithNotification(
      dispatch,
      'The invitation has been resend',
      error => `Error resending the invitation: ${error.message}`,
      () => teamService.resendInvitation(teamId, participant._id),
    );
  },
});

export default compose(
  withTracker(() => ({
    currentUserId: Meteor.userId(),
  })),

  withStyles(styles),

  connect(null, mapDispatchToProps),
)(TeamParticipants);
