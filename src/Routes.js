import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import React, { Component, useState, useEffect } from "react";
import App from "./App";
import EditAdd from "./EditAdd";
import Login from "./Login";

export default function routing() {
  return (
    <Router>
      <div>
        <switch>
          <Route exact path="/" component={App} />
          <Route exact path="/Login" component={Login} />
          <Route path="/admin" component={EditAdd} />
        </switch>
      </div>
    </Router>
  );
}
