import React from "react";
import PropTypes from "prop-types";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; //todo check it (all occurrences)
import withStyles from "@material-ui/core/styles/withStyles";
import teamsPageStyle from "./teamsPageStyle.jsx";
import { Link } from "react-router-dom";
import TeamTile from "./teamTile";
import { withTracker } from "meteor/react-meteor-data";
import { Teams } from "../../collections";
import Grid from "@material-ui/core/Grid";
import { compose } from "redux";

class TeamsPage extends React.PureComponent {
  render() {
    const { classes, teams } = this.props;

    return (
      <div>
        <Grid container>
          {teams.map(({ _id: teamId }) => {
            return (<Grid item key={teamId} xs={12} sm={6} md={3}>
              <TeamTile teamId={teamId} />
            </Grid>);
          })}
        </Grid>
        {/*todo replace url with something like "/teams/new". Use /teams/:id/edit for edit exists */}
        <Fab color="primary" className={classes.addCardFab} component={Link} to="/team-settings">
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

TeamsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withTracker(() => {
    return {
      teams: Teams.find().fetch()
    };
  }),

  withStyles(teamsPageStyle)
)(TeamsPage);
