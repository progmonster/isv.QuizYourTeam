import React from 'react';
import { Meteor } from 'meteor/meteor';
import withStyles from '@material-ui/core/styles/withStyles';
import { Roles } from 'meteor/alanning:roles';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import { isEqual } from 'lodash';
import { orange } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { Teams } from '../../../model/collections';
import AlertDialog from '../../components/alertDialog';
import { snackbarActions as snackbar } from '../../components/snackbar';
import Team from '../../../model/team';
import TeamParticipants from './teamParticipants';
import teamService from '../../services/teamService';

const styles = {
  teamSettingsCardHeaderRoot: {
    backgroundColor: orange[500],
  },

  teamSettingsCardHeaderTitle: {
    color: 'white',
  },

  teamSettingsCardSubheaderTitle: {
    color: 'white',
  },
};

class TeamSettingsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      originalTitle: '',
      title: '',
      description: '',
      removeConfirmationOpened: false,
    };
  }

  componentDidMount() {
    this.updateStateFromProps();
  }

  componentDidUpdate(prevProps) {
    const {
      team,
    } = this.props;

    if (!isEqual(prevProps.team, team)) {
      this.updateStateFromProps();
    }
  }

  handleRemoveConfirmationClosed = (confirmed) => {
    const {
      onTeamRemove,
    } = this.props;

    this.setState({ removeConfirmationOpened: false });

    if (confirmed) {
      onTeamRemove();
    }
  };

  onTitleChange = (title) => {
    this.setState({ title });
  };

  onDescriptionChange = (description) => {
    this.setState({ description });
  };

  onTeamSave = () => {
    const {
      onTeamSave,
    } = this.props;

    const {
      title,
      description,
    } = this.state;

    onTeamSave({
      title: title.trim(),
      description: description.trim(),
    });
  };

  getCreatorFormatted = () => {
    const { team } = this.props;

    if (!team) {
      return undefined;
    }

    const { creator } = team;

    if (creator.fullName) {
      return `${creator.fullName} (${creator.email})`;
    }

    return creator.email;
  };

  updateStateFromProps() {
    const {
      team,
    } = this.props;

    this.setState({
      originalTitle: team ? team.title : '',
      title: team ? team.title : '',
      description: team ? team.description : '',
    });
  }

  getTitle() {
    const {
      isNewTeam,
      isCurrentUserAdmin,
    } = this.props;

    if (isNewTeam) {
      return 'New Team';
    }

    return isCurrentUserAdmin ? 'Edit Team Settings' : 'View Team Settings';
  }

  getSubheader() {
    const {
      isNewTeam,
      isCurrentUserAdmin,
    } = this.props;

    const {
      originalTitle,
    } = this.state;

    if (isNewTeam || !originalTitle) {
      return null;
    }

    return isCurrentUserAdmin
      ? `You are editing '${originalTitle}' team settings`
      : `You are viewing '${originalTitle}' team settings`;
  }

  render() {
    const {
      classes,
      isNewTeam,
      teamLoaded,
      team,
      isCurrentUserAdmin,
    } = this.props;

    const {
      originalTitle,
      title,
      description,
      removeConfirmationOpened,
    } = this.state;

    if (!teamLoaded) {
      return <div />;
    }

    return (
      <Grid container justify="space-around">
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardHeader
              classes={{
                root: classes.teamSettingsCardHeaderRoot,
                title: classes.teamSettingsCardHeaderTitle,
                subheader: classes.teamSettingsCardSubheaderTitle,
              }}

              title={this.getTitle()}

              subheader={this.getSubheader()}
            />

            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={event => this.onTitleChange(event.target.value)}
                    margin="normal"
                    disabled={!isNewTeam && !isCurrentUserAdmin}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Description"
                    multiline
                    rowsMax="10"
                    value={description}
                    onChange={event => this.onDescriptionChange(event.target.value)}
                    margin="normal"
                    disabled={!isNewTeam && !isCurrentUserAdmin}
                  />
                </Grid>

                {!isNewTeam && (
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Creator"
                      value={this.getCreatorFormatted()}
                      margin="normal"
                      disabled
                      fullWidth
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {(isNewTeam || isCurrentUserAdmin) && (
          <Grid item xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={this.onTeamSave}>
              {isNewTeam ? 'Create Team' : 'Save Team Settings'}
            </Button>
          </Grid>
        )}

        <AlertDialog
          open={removeConfirmationOpened}
          title="Remove the team?"
          contentText=""
          okText="Remove"
          cancelText="Cancel"
          handleClose={this.handleRemoveConfirmationClosed}
        />

        {!isNewTeam && (
          <Grid item xs={12} sm={12} md={8}>
            <TeamParticipants
              team={team}
            />
          </Grid>
        )}

        {!isNewTeam && isCurrentUserAdmin && (
          <Grid item xs={12} sm={12} md={8}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.setState({ removeConfirmationOpened: true })}
            >
              Remove team
            </Button>
          </Grid>
        )}
      </Grid>
    );
  }
}

TeamSettingsPage.propTypes = {
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
};

TeamSettingsPage.defaultProps = {
  team: null,
};

const mapDispatchToProps = (dispatch, { history, isNewTeam, teamId }) => ({
  async onTeamSave(teamSettings) {
    if (isNewTeam) {
      try {
        const createdTeamId = await teamService.create(teamSettings);

        history.replace(`/team-settings/${createdTeamId}`);

        dispatch(snackbar.show({ message: 'The team has been successfully created' }));
      } catch (error) {
        console.log(error);

        dispatch(snackbar.show({ message: `Error creating the team: ${error.message}` }));
      }
    } else {
      try {
        await teamService.updateTeamSettings({ _id: teamId, ...teamSettings });

        dispatch(snackbar.show({ message: 'The team settings have been successfully updated' }));

        history.push('/teams');
      } catch (error) {
        console.log(error);

        dispatch(snackbar.show({ message: `Error updating the team settings: ${error.message}` }));
      }
    }
  },

  async onTeamRemove() {
    try {
      await teamService.remove(teamId);

      history.replace('/teams');

      dispatch(snackbar.show({ message: 'The team has been successfully removed' }));
    } catch (error) {
      console.log(error);

      dispatch(snackbar.show({ message: `Error removing the team: ${error.message}` }));
    }
  },
});

export default compose(
  withStyles(styles),

  withTracker((props) => {
    const { teamId } = props.match.params;

    const isNewTeam = !teamId;

    const teamSubscription = isNewTeam ? null : Meteor.subscribe('team', teamId);

    if (!isNewTeam) {
      Meteor.subscribe('team', teamId);
    }

    const team = teamId && Teams.findOne(teamId);

    const teamLoaded = isNewTeam || (teamSubscription.ready() && !!team);

    const isCurrentUserAdmin = Roles.isTeamAdmin(Meteor.userId(), teamId);

    return {
      isNewTeam,
      teamId,
      team,
      teamLoaded,
      isCurrentUserAdmin,
    };
  }),

  connect(null, mapDispatchToProps),
)(TeamSettingsPage);
