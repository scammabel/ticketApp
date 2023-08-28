import { getCurrentUser } from './api.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import App from './components/App.js';
import AdminHome from './components/AdminHome.js';
import ManageTheatres from './components/ManageTheatres.js';
import ManageShows from './components/ManageShows.js';
import AddShow from './components/AddShow.js';
import ShowDetails from './components/ShowDetails.js';
import Booking from './components/Booking.js';
import Bookings from './components/Bookings.js';


const routes = [
  { path: '/',  redirect: '/register' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/home', component: Home, name: 'Home' },
  { path: '/admin', component: AdminHome, name: 'AdminHome' },
  { path: '/admin/theatres', component: ManageTheatres, name: 'ManageTheatres' },
  { path: '/admin/shows', component: ManageShows, name: 'ManageShows' },
  { path: '/admin/show', component: AddShow, name: 'AddShow' },
  { path: '/show/:showId', component: ShowDetails, name: 'ShowDetails' },
  { path: '/book/:showId', component: Booking, name: 'BookTickets' },
  { path: '/bookings', component: Bookings, name: 'Bookings' },
];


async function fetchUserRole() {
  try {
    const currentUser = await getCurrentUser();
    return currentUser.roles[0];
  } catch (error) {
    return null;
  }
}


const router = new VueRouter({
  mode: 'hash',
  routes
});

//Navigation guard for accessing pages based on login status and role

router.beforeEach(async (to, from, next) => {
  const userRole = await fetchUserRole();

  // If user tries to access the login or register route while already authenticated
  if ((to.path === '/login' || to.path === '/register') && userRole) {
    if (userRole === 'admin') {
      return next('/admin');
    } else {
      return next('/home');
    }
  }

  // If user is not authenticated and tries to access any other page than login or register
  if (to.path !== '/login' && to.path !== '/register' && !userRole) {
    return next('/login');
  }

  // If user is trying to access admin pages but is not an admin
  if (to.path.startsWith('/admin') && userRole !== 'admin') {
    return next('/home');
  }

  next();
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

