import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { parse as parseQueryString } from 'query-string';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class SetInitialPasswordPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      password: '',
      passwordUpdated: false,
      error: false,
    };
  }

  getToken = () => parseQueryString(this.props.location.search).token;

  onPasswordChanged = event => this.setState({ password: event.target.value });

  onPasswordSet = () => {
    Accounts.resetPassword(this.getToken(), this.state.password.trim(), (error) => {
      if (error) {
        console.log(error);

        this.setState({ error: true });
      } else {
        this.setState({ passwordUpdated: true });
      }
    });
  };

  render() {
    return (
      <Grid container justify="space-around">
        <Grid item xs={12} sm={8} md={4}>
          <TextField
            required
            id="initialPassword"
            label="Password"
            value={this.state.password}
            onChange={this.onPasswordChanged}
            margin="normal"
            /*
                          error
            */
            type="password"
            autoComplete="current-password"
            /*
                          helperText="Some important text"
            */
          />
        </Grid>

        <Grid item xs={12} sm={8} md={4}>
          <Button color="primary" onClick={this.onPasswordSet}>
            Set password
          </Button>
        </Grid>

        <Grid item xs={12} sm={8} md={4}>
          <h2>
            {this.state.passwordUpdated ? 'Password updated!' : (this.state.error ? 'Error updating password!' : '')}
          </h2>

          {this.state.passwordUpdated &&
          <Link component={RouterLink} to="/" replace>Go to dashboard</Link>}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SetInitialPasswordPage);
