module.exports = [{
    path: '/',
    name: 'index',
    component: ()=>import(/* webpackChunkName: "home" */'pages/Home'),
  }, {
    path: '/sort',
    component: ()=>import(/* webpackChunkName: "sort" */'pages/Sort'),
  }, {
  path: '/',
  routes: [
    {
      path: 'welcome',
      name: 'welcome',
      icon: 'smile',
      component: ()=>import(/* webpackChunkName: "Welcome" */'pages/Welcome'),
    }
  ]}
]
