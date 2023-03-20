export default [
  { path: '/login', component: '@/pages/Login' },

  {
    path: '/',
    component: '@/layouts/BaseLayout',

    routes: [
      {
        path: '/content',
        component: '@/pages/Content',
        wrappers: ['@/wrappers/auth'],
      },
      { path: '/contentTwo', component: '@/pages/ContentTwo' },
      { path: '/contentThird', component: '@/pages/ContentThird' },
      // { component: '@/pages/404' },
    ],
  },
  { component: '@/pages/404' },
];
