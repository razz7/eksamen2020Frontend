import React, { Component } from "react";
import facade from "./apifacade";
import App from "./App";
import { NavLink } from "react-router-dom";
class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }

  login = evt => {
    evt.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };
  onChange = evt => {
    this.setState({ [evt.target.id]: evt.target.value });
  };
  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.login} onChange={this.onChange}>
          <input placeholder="User Name" id="username" />
          <input placeholder="Password" id="password" />
          <button>Login</button>
        </form>
      </div>
    );
  }
}
class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = { dataFromServer: "!!" };
  }

  getData = () => {
    facade.getData().then(data => {
      this.setState({ dataFromServer: data });
    });
  };

  componentDidMount() {}
  render() {
    return <div></div>;
  }
}
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  logout = () => {
    facade.logout();
    this.setState({ loggedIn: false });
  }; //TODO
  login = (user, pass) => {
    facade.login(user, pass).then(res => this.setState({ loggedIn: true }));
  }; //TODO
  render() {
    return (
      <div>
        {!this.state.loggedIn ? (
          <LogIn login={this.login} />
        ) : (
          <div>
            <LoggedIn />

            <button onClick={this.logout}>Logout</button>
            <App />
          </div>
        )}
      </div>
    );
  }
}

export default Login;
