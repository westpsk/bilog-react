module.exports = [{
  path: '/',
  component: ()=>import('pages/Home'),
  routes: [
    {
      path: '/',
      name: 'home',
      icon: 'smile',
      component: ()=>import('pages/Home'),
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: ()=>import('pages/Welcome'),
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import('pages/Login'),
    },
    {
      path: '/404',
      component: ()=>import('pages/404'),
    },
  ]}, {
    path: '/404',
    component: ()=>import('pages/404'),
  }
]
