import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const avatar = '';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    marginBottom: '3px',
    textDecoration: 'none',
  },
};

function Team(props) {
  const { classes } = props;
  return (
    <div>
      <Grid container>
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={12} md={5}>
                  {/*
                  <CustomInput
                    labelText="Company (disabled)"
                    id="company-disabled"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true
                    }}
                  />
*/}
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  {/*
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  {/*
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                  {/*
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  {/*
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={4}>
                  {/*
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  {/*
                  <CustomInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  {/*
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
*/}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: '#AAAAAA' }}>About me</InputLabel>
                  {/*
                  <CustomInput
                    labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5
                    }}
                  />
*/}
                </Grid>
              </Grid>
            </CardContent>
            {/*
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
*/}
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card>
            {/*
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
*/}
            <CardContent>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don't be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary">
                Follow
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Team);
