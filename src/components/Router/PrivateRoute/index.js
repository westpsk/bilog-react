import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

class PrivateRoute extends React.Component{
  render(){
    let { component: Component, store, ...rest } = this.props
    console.log(this.props, '====')
    return (
      <Route
        {...rest}
        render={props => (store.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        ))
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  store: state.Common
})

export default connect(mapStateToProps)(PrivateRoute)