import React from "react";

const URL = "142.93.108.72:8080/exambackend";
function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class ApiFacade {
  //Insert utility-methods from a latter step (d) here
  fetchData = () => {
    facade.fetchData().then(res => this.setState({ dataFromServer: res }));
    const options = this.makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  loggedIn = () => {
    const loggedIn = this.getToken() != null;
    return loggedIn;
  };
  logout = () => {
    localStorage.removeItem("jwtToken");
  };
  getData = props => {
    console.log("fetching");
    fetch(URL + props)
      .then(handleHttpErrors)
      .then(res => {
        console.log(res);
        return res;
      });
  };
  makeOptions(method, addToken, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && this.loggedIn()) {
      opts.headers["x-access-token"] = this.getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  }
  login = (user, pass) => {
    console.log(user);
    const options = this.makeOptions("POST", true, {
      username: user,
      password: pass
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        this.setToken(res.token);
      });
  };

  fetchMovies = setMovies => {
    const options = this.makeOptions("GET", true);
    fetch(URL + "/api/bike/all", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setMovies(data);
      });
  };
}

const facade = new ApiFacade();
export default facade;
