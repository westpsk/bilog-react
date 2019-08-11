import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import routeConfig from 'config/routes.config'
import Loading from 'components/Loading'
import LoginRoute from './LoginRoute'
import PrivateRoute from './PrivateRoute'
import style from './index.less'

// react-loadable 实现代码分割
function getLoadableComponent(componentImportFn, props) {
  const Component = Loadable({
    loader: componentImportFn,
    loading: Loading,
  });
  if (props) {
    return (
      <Component {...props} />
    );
  }
  return Component;
}

function loopRoutes(routes, match = {}) {
  const matchPath = match.path || '';
  return (
    // <Switch> 不是分组 <Route> 所必须的，但他通常很有用。 一个 <Switch> 会遍历其所有的子 <Route> 元素，并仅渲染与当前地址匹配的第一个元素。这有助于多个路由的路径匹配相同的路径名
    // extra:精确匹配
    <Switch>
      {
        routes.map((route) => {
          const routes = route.routes;
          if (routes) {
            return (
              <Route
                key={route.path}
                path={route.path}
                render={({ match }) => loopRoutes(routes, match)}
              />
            );
          }
          return (
            <PrivateRoute
              exact
              key={route.path}
              path={matchPath + route.path}
              component={getLoadableComponent(route.component)}
            />
          );
        })
      }
      <LoginRoute
        exact
        path="/login"
        component={getLoadableComponent(() => import('pages/Login'))}
      />
      <Route component={getLoadableComponent(() => import('pages/404'))}/>
    </Switch>
  );
}

const AppRouter = (props) => (
  <Router>
    <div className={style.matchScreen}>
      {loopRoutes(routeConfig,props)}
    </div>
  </Router>
);

export default AppRouter