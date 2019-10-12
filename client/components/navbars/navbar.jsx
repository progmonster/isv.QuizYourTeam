import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/icons/Menu';
import headerStyle from '/client/assets/jss/material-dashboard-react/components/headerStyle.jsx';
import Button from '@material-ui/core/Button';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import AdminNavbarLinks from './adminNavbarLinks.jsx'; // todo progmonster remove Admin from all names

function Header({ ...props }) {
  function makeBrand() {
    let name;
    props.routes.map((prop, key) => {
      if (prop.path === props.location.pathname) {
        name = prop.name;
      }
      return null;
    });
    return name;
  }

  const { classes, color } = props;
  const appBarClasses = classNames({
    [` ${classes[color]}`]: color,
  });

  const brand = makeBrand();

  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          {!!brand && (
            <Button href="#" className={classes.title}>
              {makeBrand()}
            </Button>
          )}
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks />
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
};

export default compose(
  withStyles(headerStyle),
  withRouter,
)(Header);
