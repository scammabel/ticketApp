const BASE_URL = 'http://127.0.0.1:5000';

const headers = {
  'Content-Type': 'application/json'
};

async function fetchAPI(endpoint, method = 'GET', body) {
  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message;
    } catch (err) {
    }
    throw new Error(errorMessage);
  }

  return response.json();
}


export const getTheatres = async () => {
  const response = await fetchAPI('/theatres');
  console.log("getTheatres response:", response);
  return response;
};

export const createTheatre = async (name, place, capacity) => {
  return fetchAPI('/theatres', 'POST', { name, place, capacity });
};

export const editTheatre = async (theatreId, data) => {
  return fetchAPI(`/theatres/${theatreId}`, 'PUT', data);
};

export const deleteTheatre = async (theatreId) => {
  return fetchAPI(`/theatres/${theatreId}`, 'DELETE');
};

export const getShows = async (searchTerm = '') => {
  if (searchTerm) {
    return fetchAPI(`/shows?search_term=${searchTerm}`);
  } else {
    return fetchAPI('/shows');
  }
};

export const getShow = async (showId) => {
  return fetchAPI(`/shows/${showId}`);
};

export const getAllShows = async () => {
  return fetchAPI(`/shows`);
};

export const createShow = async (showData) => {
  return fetchAPI('/shows', 'POST', showData);
};

export const editShow = async (showId, showData) => {
  return fetchAPI(`/shows/${showId}`, 'PUT', showData);
};

export const deleteShow = async (showId) => {
  return fetchAPI(`/shows/${showId}`, 'DELETE');
};

export const getShowtimesForTheatre = async (theatreId) => {
  return fetchAPI(`/theatres/${theatreId}/showtimes`);
};

export const getShowtimesForShow = async (showId) => {
  return fetchAPI(`/shows/${showId}/showtimes`);
};

export const getAllShowtimes = async () => {
  return fetchAPI('/showtimes');
};

export const getShowtime = async (showtimeId) => {
  return fetchAPI(`/showtimes/${showtimeId}`);
};

export const createShowtime = async (showData) => {
  return fetchAPI('/showtimes', 'POST', showData);
};

export const deleteShowtime = async (showtimeId) => {
  return fetchAPI(`/showtimes/${showtimeId}`, 'DELETE');
};

export const bookTickets = async (showtimeId, numberOfTickets) => {
  return fetchAPI('/bookings', 'POST', { showtime_id: showtimeId, number_of_tickets: numberOfTickets });
};

export const getUserBookings = async () => {
  return fetchAPI('/bookings');
};

export const cancelBooking = async (bookingId) => {
  return fetchAPI(`/bookings/${bookingId}`, 'DELETE');
};