import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ProjectView from '@/views/ProjectView.vue'
import ProjectCreateView from '@/views/Project/CreateView.vue'
import EmployeeReadView from '@/views/Employee/ReadView.vue'
import EmployeeCreateView from '@/views/Employee/CreateView.vue'
import AttendanceCreateView from '@/views/Employee/AttendanceCreateView.vue'
import TaskCreateView from '@/views/Task/CreateView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/employee/:id',
    name: 'employee-read',
    component: EmployeeReadView
  },
  {
    path: '/employee/create',
    name: 'employee-create',
    component: EmployeeCreateView
  },
  {
    path: '/employee/attendance',
    name: 'employee-attendance',
    component: AttendanceCreateView
  },
  {
    path: '/project',
    name: 'project',
    component: ProjectView
  },
  {
    path: '/project/create',
    name: 'project-create',
    component: ProjectCreateView
  },
  {
    path: '/task/create/:id',
    name: 'task-create',
    component: TaskCreateView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
