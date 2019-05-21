import { Meteor } from 'meteor/meteor';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, withHistory } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import AdminNavbarLinks from '/client/components/navbars/adminNavbarLinks.jsx';
import sidebarStyle from '/client/assets/jss/material-dashboard-react/components/sidebarStyle.jsx';
import { compose } from 'redux';
import { ExitToApp } from '@material-ui/icons';
import { withTracker } from 'meteor/react-meteor-data';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

const Sidebar = ({ ...props }) => {
  const userEmail = props.user && props.user.emails[0].address;

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }

  const onSignOut = () => {
    Meteor.logout((error) => {
      if (error) {
        console.log(error);
      } else {
        props.history.push("/login");
      }
    });
  };

  const {
    classes, color, logo, image, logoText, routes,
  } = props;
  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        let activePro = ' ';
        let listItemClasses;
        if (prop.path === '/upgrade-to-pro') {
          activePro = `${classes.activePro} `;
          listItemClasses = classNames({
            [` ${classes[color]}`]: true,
          });
        } else {
          listItemClasses = classNames({
            [` ${classes[color]}`]: activeRoute(prop.path),
          });
        }
        const whiteFontClasses = classNames({
          [` ${classes.whiteFont}`]: activeRoute(prop.path),
        });
        return (
          <NavLink
            to={prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              {typeof prop.icon === 'string' ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                />
              )}
              <ListItemText
                primary={
                  prop.name
                }
                className={classNames(classes.itemText, whiteFontClasses)}
                disableTypography
              />
            </ListItem>

          </NavLink>
        );
      })}

      <ListItem button className={classes.itemLink}>
        <ListItemText
          primary={userEmail}
          className={classNames(classes.itemText)}
          disableTypography

        />

        <ListItemSecondaryAction>
          <IconButton aria-label="Sign Out" onClick={onSignOut}>
            <ExitToApp className={classNames(classes.itemIcon)} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
  const brand = (
    <div className={classes.logo}>
      <a
        href="https://www.creative-tim.com"
        className={classNames(classes.logoLink)}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks />
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {brand}

          <div className={classes.sidebarWrapper}>{links}</div>


          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(sidebarStyle),

  withTracker(() => ({
    user: Meteor.user(),
  })),
)(Sidebar);
