import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '../pages/DashboardPage.vue';

const getCurrentSprintId = () => {
  // #NOTE реализовать получение из локала
  return 1; 
};

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: () => {
      const currentSprintId = getCurrentSprintId();
      return `/sprint/${currentSprintId}`;
    }
  },
	{
    path: '/sprint/:id',
    name: 'Sprint',
    component: DashboardPage,
    props: route => ({
      sprintId: route.params.id,
      tab: route.query.tab || "metrics"
    })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;