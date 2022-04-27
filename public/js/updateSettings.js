import axios from 'axios';
import '@babel/polyfill';
import { showAlert } from './alerts';

// type can be password or data
export const updateSettings = async (providedData, type) => {
  const jwtToken = document.cookie.split('=')[1];
  console.log(jwtToken);
  const url =
    type === 'password'
      ? 'http://127.0.0.1:8080/api/v1/users/updatePassword'
      : 'http://127.0.0.1:8080/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      headers: {
        'Access-Control-Allow-Origin': 'true',
        Authorization: `Bearer ${jwtToken}`,
      },
      xhrFields: { withCredentials: true },
      url: url,
      data: providedData,
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      if (res.data)
        document.cookie = `jwt=${res.data.token};max-age=${60 * 60 * 24 * 10}`;
    }
  } catch (err) {
    showAlert('error', err.respone.data.message);
  }
};
