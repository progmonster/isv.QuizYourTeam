import { Accounts } from "meteor/accounts-base";
import React from "react";
import { withStyles } from '@material-ui/core/styles';
import {parse as parseQueryString} from "query-string";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});


class EmailVerificationPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { confirmed: false, error: false };
  }

  componentDidMount() {
    const token = parseQueryString(this.props.location.search).token;

    console.log(token);

    this.setState({ confirmed: true });

/*
    Accounts.verifyEmail(this.props.location.query.token, (error) => {
      if (error) {
        console.log(error);

        this.setState({ error: true });
      } else {
        this.setState({ confirmed: true });
      }
    });
*/
  }

  render() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={4}>
          <h2>
            {!this.state.confirmed && !this.state.error
            ? "Confirmation in progress..."
            : (this.state.confirmed ? "Confirmed!": "Error!")}
          </h2>

          {this.state.confirmed && <Link component={RouterLink} to="/" replace>Go to dashboard</Link>}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(EmailVerificationPage);