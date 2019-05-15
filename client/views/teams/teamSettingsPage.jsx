import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
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
      teamLoaded,
    } = this.props;

    if (!prevProps.teamLoaded && teamLoaded) {
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

  render() {
    const {
      classes,
      isNewTeam,
      teamLoaded,
      team,
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

              title={isNewTeam ? 'New Team' : 'Edit Team Settings'}

              subheader={
                !isNewTeam && originalTitle
                  ? `You are editing '${originalTitle}' team settings`
                  : null
              }
            />

            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={event => this.onTitleChange(event.target.value)}
                    margin="normal"
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
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Creator"
                    value={this.getCreatorFormatted()}
                    margin="normal"
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={this.onTeamSave}>
            {isNewTeam ? 'Create Team' : 'Save Team Settings'}
          </Button>
        </Grid>

        {!isNewTeam && (
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
        await teamService.create(teamSettings);

        dispatch(snackbar.show({ message: 'The team has been successfully created' }));

        history.push('/teams');
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
  withTracker((props) => {
    const { teamId } = props.match.params;

    const isNewTeam = !teamId;

    const teamSubscription = isNewTeam ? null : Meteor.subscribe('team', teamId);

    if (!isNewTeam) {
      Meteor.subscribe('team', teamId);
    }

    return {
      isNewTeam,
      teamId,
      team: teamId && Teams.findOne(teamId),
      teamLoaded: isNewTeam || teamSubscription.ready(),
    };
  }),

  withStyles(styles),
  connect(null, mapDispatchToProps),
)(TeamSettingsPage);
