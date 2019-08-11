module.exports = [{
    path: '/',
    name: 'index',
    component: ()=>import('pages/Home'),
  }, {
    path: '/login',
    name: 'login',
    component: ()=>import('pages/Login'),
  }, {
    path: '/404',
    component: ()=>import('pages/404'),
  }, {
  path: '/',
  routes: [
    {
      path: 'welcome',
      name: 'welcome',
      icon: 'smile',
      component: ()=>import('pages/Welcome'),
    }
  ]}
]
