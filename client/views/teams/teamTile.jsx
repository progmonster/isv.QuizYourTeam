import React from 'react';
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
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import SettingsIcon from '@material-ui/icons/Settings';
import size from 'lodash/size';
import { Link } from 'react-router-dom';
import { Teams } from '../../../model/collections';

const styles = theme => ({
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
      classes, team, teamId, roles,
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={team.title}
          subheader={`Participants: ${team.getActiveParticipantCount()}`}
          // todo show quiz count
        />

        <CardContent>
          <Typography component="p">
            {team.description}
          </Typography>
        </CardContent>

        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Configure" component={Link} to={`/team-settings/${teamId}`}>
            <SettingsIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

TeamTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withTracker(({ teamId }) => ({
    team: Teams.findOne(teamId),

    roles: {
      /*
                editQuiz: Roles.userIsInRole(Meteor.userId(), "editQuiz", `quizzes/${quizId}`),
                removeQuiz: Roles.userIsInRole(Meteor.userId(), "removeQuiz", `quizzes/${quizId}`),
                passQuiz: Roles.userIsInRole(Meteor.userId(), "passQuiz", `quizzes/${quizId}`),
        */
    },
  })),

  withStyles(styles),
)(TeamTile);
