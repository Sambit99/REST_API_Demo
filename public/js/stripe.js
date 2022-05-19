import axios from 'axios';
import { showAlert } from './alerts';
// const stripe = Stripe(
//   'pk_test_51KyrnkSEW8GTI4q77Og9SPIagjBvns8dqExNJaojgWS4o9GV0zYEFSbY7LRhc5qyMS3MQSMzL3lXerALDy565O4D006TaLneJq'
// );

exports.bookTour = async (tourId) => {
  try {
    // 1. Get chceckout session from API
    const session = await axios({
      url: `http://127.0.0.1:8080/api/v1/bookings/checkout-session/${tourId}`,
    });
    console.log(session);
    // console.log(stripe);
    // 2. Create checkout form and charge credit card
    // window.location.assign session.data.session.url
    window.location.assign(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err.message);
  }
};
