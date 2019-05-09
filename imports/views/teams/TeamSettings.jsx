import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as PropTypes from "prop-types";
import { compose } from "redux";
import { orange } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { withTracker } from "meteor/react-meteor-data";
import { Teams } from "../../collections";
import Methods from "../../../client/methods";
import { connect } from "react-redux";
import AlertDialog from "../../components/alertDialog";
import { snackbarActions as snackbar } from "../../components/snackbar";

const styles = {
  teamSettingsCardHeaderRoot: {
    backgroundColor: orange[500],
  },

  teamSettingsCardHeaderTitle: {
    color: "white",
  },

  teamSettingsCardSubheaderTitle: {
    color: "white",
  },
};

class TeamSettings extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      originalTitle: "",
      title: "",
      description: "",
      removeConfirmationOpened: false,
    };
  }

  updateStateFromProps() {
    this.setState({
        originalTitle: !!this.props.team ? this.props.team.title : "",
        title: !!this.props.team ? this.props.team.title : "",
        description: !!this.props.team ? this.props.team.description : "",
      }
    );
  }

  componentDidMount() {
    this.updateStateFromProps();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.teamLoaded && this.props.teamLoaded) {
      this.updateStateFromProps();
    }
  }

  onTitleChange = (title) => {
    this.setState({ title });
  };

  onDescriptionChange = (description) => {
    this.setState({ description });
  };

  onTeamSave = () => {
    this.props.onTeamSave({
      title: this.state.title.trim(),
      description: this.state.description.trim(),
    })
  };

  handleRemoveConfirmationClosed = (confirmed) => {
    this.setState({ removeConfirmationOpened: false });

    if (confirmed) {
      this.props.onTeamRemove();
    }
  };

  render() {
    const {
      classes,
      isNewTeam,
      team,
      teamLoaded,
      onTeamRemove,
    } = this.props;

    if (!teamLoaded) {
      return <div />;
    }

    return (
      <Grid container justify="space-around">
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardHeader
              classes={{
                root: classes.quizEditorCardHeaderRoot,
                title: classes.quizEditorCardHeaderTitle,
                subheader: classes.quizEditorCardSubheaderTitle
              }}

              title={isNewTeam ? "New Team" : "Edit Team Settings"}

              subheader={
                !isNewTeam && this.state.originalTitle
                  ? `You are editing '${this.state.originalTitle}' team settings`
                  : null
              }
            />

            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Title"
                    value={this.state.title}
                    onChange={event => this.onTitleChange(event.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Description"
                    multiline
                    rowsMax="10"
                    value={this.state.description}
                    onChange={event => this.onDescriptionChange(event.target.value)}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={this.onTeamSave}>
            {isNewTeam ? "Create Team" : "Save Team Settings"}
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
          open={this.state.removeConfirmationOpened}
          title={"Remove the team?"}
          contentText={""}
          okText={"Remove"}
          cancelText={"Cancel"}
          handleClose={this.handleRemoveConfirmationClosed}
        />
      </Grid>
    );
  }
}

TeamSettings.propTypes = {
  classes: PropTypes.any,
};

const mapDispatchToProps = (dispatch, { history, isNewTeam, teamId }) => {
  return {
    /*
        onTeamSave: () => {
          dispatch(saveEditingQuiz(history));
        },
    */

    async onTeamSave(teamSettings) {
      if (isNewTeam) {
        try {
          await Methods.teams.createTeamAsync(teamSettings);

          dispatch(snackbar.show({ message: "The team has been successfully created" }));

          history.push("/teams");
        } catch (error) {
          console.log(error);

          dispatch(snackbar.show({ message: `Error creating the team: ${error.message}` }));
        }
      } else {
        try {
          await Methods.teams.updateTeamSettingsAsync({ _id: teamId, ...teamSettings });

          dispatch(snackbar.show({ message: "The team settings have been successfully updated" }));

          history.push("/teams");
        } catch (error) {
          console.log(error);

          dispatch(snackbar.show({ message: `Error updating the team settings: ${error.message}` }));
        }
      }
    },

    async onTeamRemove() {
      try {
        await Methods.teams.removeTeamAsync(teamId);

        dispatch(snackbar.show({ message: "The team has been successfully removed" }));

        history.replace("/teams");
      } catch (error) {
        console.log(error);

        dispatch(snackbar.show({ message: `Error removing the team: ${error.message}` }));
      }
    }
  }
};

export default compose(
  withTracker((props) => {
    const teamId = props.match.params.teamId;

    const isNewTeam = !teamId;

    const teamSubscription = isNewTeam ? null : Meteor.subscribe("team", teamId);

    if (!isNewTeam) {
      Meteor.subscribe("team", teamId);
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
)(TeamSettings);
