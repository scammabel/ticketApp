//import Landing from './components/Landing.vue';
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
  { path: '/',  redirect: '/home' },
  { path: '/home', component: Home, name: 'Home' },
  { path: '/admin', component: AdminHome, name: 'AdminHome' },
  { path: '/admin/theatres', component: ManageTheatres, name: 'ManageTheatres' },
  { path: '/admin/shows', component: ManageShows, name: 'ManageShows' },
  { path: '/admin/show', component: AddShow, name: 'AddShow' },
  { path: '/show/:showId', component: ShowDetails, name: 'ShowDetails' },
  { path: '/book/:showId', component: Booking, name: 'BookTickets' },
  { path: '/bookings', component: Bookings, name: 'Bookings' },
];


const router = new VueRouter({
  mode: 'hash',
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

