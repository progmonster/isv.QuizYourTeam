import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import withStyles from '@material-ui/core/styles/withStyles';
import Navbar from '/imports/components/Navbars/Navbar.jsx';
import Sidebar from '/imports/components/Sidebar/Sidebar.jsx';
import { drawerRoutes } from '/imports/routes.js';

import dashboardStyle
  from '/imports/assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx';
import { compose } from 'redux';
import authForwarder from '../views/auth/authForwarder';

const image = ''/* "/assets/img/sidebar-2.jpg" */;

const logo = '/img/reactlogo.png';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image,
      color: 'blue',
      hasImage: true,
      fixedClasses: 'dropdown show',
      mobileOpen: false,
    };
  }

  handleImageClick = (image) => {
    this.setState({ image });
  };

  handleColorClick = (color) => {
    this.setState({ color });
  };

  handleFixedClick = () => {
    if (this.state.fixedClasses === 'dropdown') {
      this.setState({ fixedClasses: 'dropdown show' });
    } else {
      this.setState({ fixedClasses: 'dropdown' });
    }
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return this.props.location.pathname !== '/maps';
  }

  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener('resize', this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={drawerRoutes}
          logoText="Quiz Your Teams"
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Navbar
            routes={drawerRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />

          <div className={classes.content}>
            <div className={classes.container}>{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(dashboardStyle),
  authForwarder,
)(Dashboard);
