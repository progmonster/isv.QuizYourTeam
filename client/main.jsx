import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import Admin from "/imports/layouts/Admin.jsx";
import RTL from "/imports/layouts/RTL.jsx";
import "/imports/assets/css/material-dashboard-react.css";
import { createStore } from "redux";
import reducers from "/imports/reducers";
import { Provider } from "react-redux";

Meteor.startup(() => {
  const hist = createBrowserHistory();

  const store = createStore(reducers);

  ReactDOM.render(
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/rtl" component={RTL} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});


