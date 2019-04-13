import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import Button from "@material-ui/core/Button";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "/imports/layouts/Admin.jsx";
import RTL from "/imports/layouts/RTL.jsx";
import "/imports/assets/css/material-dashboard-react.css?v=1.6.0";

Meteor.startup(() => {
  const hist = createBrowserHistory();

  ReactDOM.render(
    <Router history={hist}>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/rtl" component={RTL} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </Router>,
    document.getElementById("root")
  );
});


