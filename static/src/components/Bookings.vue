<template>
    <div>
      <h1>Your Bookings</h1>
      <div v-if="bookings.length === 0">You have no bookings.</div>
      <div v-for="booking in bookings" :key="booking.id">
        <h3>{{ booking.show.name }} ({{ booking.showtime.start_time }} - {{ booking.showtime.end_time }})</h3>
        <p>Tickets: {{ booking.numberOfTickets }}</p>
        <button @click="cancelBooking(booking.id)">Cancel Booking</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getUserBookings, cancelBooking } from '../api';
  
  export default {
    name: 'Bookings',
    data() {
      return {
        bookings: [],
      };
    },
    async created() {
      this.bookings = await getUserBookings();
    },
    methods: {
      async cancelBooking(bookingId) {
        try {
          const message = await cancelBooking(bookingId);
          alert(message); // Display success message
          this.bookings = this.bookings.filter(booking => booking.id !== bookingId); // Remove the canceled booking from the list
        } catch (error) {
          console.error(error);
          alert('Failed to cancel the booking. Please try again.'); // Display error message
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any specific styling for the Bookings component here */
  </style>
  