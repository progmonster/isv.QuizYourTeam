import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
class SignUpPage extends React.Component {
  state = {
    email: '',
    password: '',
  };

  onTextFieldChange = name => (event) => {
    this.setState({ [name]: event.target.value });
  };

  onSignUp = () => {
    Accounts.createUser(
      {
        email: this.state.email,
        password: this.state.password,
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          this.props.history.replace('/signup-confirmation-note');
        }
      },
    );
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
                  id="signUpEmail"
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
                  id="signUpPassword"
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
                <Button color="primary" onClick={this.onSignUp}>
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SignUpPage);
