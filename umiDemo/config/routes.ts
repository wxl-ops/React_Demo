export default [
  { path: '/login', component: '@/pages/Login' },

  {
    path: '/',
    component: '@/layouts/BaseLayout',

    routes: [
      { path: '/', redirect: '/content' },
      {
        path: '/content',
        component: '@/pages/Content',
        wrappers: ['@/wrappers/auth'],
      },
      { path: '/contentTwo/:id', component: '@/pages/ContentTwo' },
      { path: '/contentThird', component: '@/pages/ContentThird' },
      // { component: '@/pages/404' },
    ],
  },
  { component: '@/pages/404' },
];
