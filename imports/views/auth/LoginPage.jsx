import React from "react";
import Grid from "@material-ui/core/Grid";

class LoginPage extends React.PureComponent {
  render() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={4}>
          <h2>login!</h2>
        </Grid>
      </Grid>
    );
  }
}

export default LoginPage;