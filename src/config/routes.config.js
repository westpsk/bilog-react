module.exports = [{
    path: '/',
    name: 'index',
    component: ()=>import(/* webpackChunkName: "home" */'pages/Home'),
  }, {
    path: '/sort',
    component: ()=>import(/* webpackChunkName: "sort" */'pages/Sort'),
  }, {
    path: '/time',
    component: ()=>import(/* webpackChunkName: "sort" */'pages/Time'),
  }, {
    path: '/',
    routes: [
      {
        path: 'welcome',
        name: 'welcome',
        icon: 'smile',
        component: ()=>import(/* webpackChunkName: "Welcome" */'pages/Welcome'),
      }
    ]
  }
]
