import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import MainLayout from "/imports/layouts/MainLayout.jsx";
import "/imports/assets/css/material-dashboard-react.css";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "/imports/reducers";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { rootSaga } from "../imports/actions";
import { SnackbarProvider } from "../imports/components/snackbar";

Meteor.subscribe("quizzes");

Meteor.startup(() => {
  const hist = createBrowserHistory();

  const loggerMiddleware = createLogger();

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    applyMiddleware(loggerMiddleware, sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);

  ReactDOM.render(
    <Provider store={store}>
      <SnackbarProvider SnackbarProps={{ autoHideDuration: 3500 }}>
        <Router history={hist}>
          <Switch>
            <Route path="/admin" component={MainLayout} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </Router>
      </SnackbarProvider>
    </Provider>,

    document.getElementById("root")
  );
});


