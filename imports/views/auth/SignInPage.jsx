import { Meteor } from 'meteor/meteor';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

// todo progmonster replace path with /dashboard is already signed in
class SignInPage extends React.Component {
  state = {
    email: '',
    password: '',
  };

  onTextFieldChange = name => (event) => {
    this.setState({ [name]: event.target.value });
  };

  onSignIn = () => {
    Meteor.loginWithPassword(this.state.email, this.state.password, (error) => {
      if (error) {
        console.log(error);
      } else {
        // todo progmonster go to the url that the user had requested before they moved to the login page
        this.props.history.replace('/dashboard');
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={4}>
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  required
                  id="signInEmail"
                  label="Email"
                  className={classes.textField}
                  value={this.state.email}
                  onChange={this.onTextFieldChange('email')}
                  margin="normal"
                  /*
                                placeholder="Placeholder"
                  */
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  id="signInPassword"
                  label="Password"
                  className={classes.textField}
                  value={this.state.password}
                  onChange={this.onTextFieldChange('password')}
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

              <Grid item xs={12}>
                <Button color="primary" onClick={this.onSignIn}>
                  Sign In
                </Button>

                <Link component={RouterLink} to="/signup">Sign Up</Link>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SignInPage);
