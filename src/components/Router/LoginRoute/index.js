import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

class LoginRoute extends React.Component {
  render() {
    let { component: Component, store, ...rest } = this.props

    return (
      <Route
        {...rest}
        render={props => (
          store.isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          ) : (
            <Component {...props} isLoginIng={store.isLoginIng} onLoginSuccess={store.onLoginSuccess} />
          )
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  store: state.Common
})
export default connect(mapStateToProps)(LoginRoute)
