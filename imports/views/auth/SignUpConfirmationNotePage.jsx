import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});


class SignUpConfirmationNotePage extends React.PureComponent {
  render() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={4}>
          <h2>We sent you confirmation email. Please check. You may close the page</h2>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SignUpConfirmationNotePage);