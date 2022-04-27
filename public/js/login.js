/*eslint-disable*/
// const catchAsync = require('./../../utils/catchAsync');

import axios from 'axios';
import '@babel/polyfill';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log(email, password);
  try {
    axios.defaults.withCredentials = true;
    const res = await axios({
      headers: {
        'Access-Control-Allow-Origin': 'true',
      },
      method: 'POST',
      // withCredentials: true,
      xhrFields: { withCredentials: true },
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Logged in successfully`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // const res = await axios.post(
    //   'http://127.0.0.1:8080/api/v1/users/login',
    //   {
    //     email,
    //     password,
    //   },
    //   { withCredentials: true }
    // );

    // const res = await fetch('http://127.0.0.1:8080/api/v1/users/login', {
    //   method: 'POST',
    //   mode: 'cors',
    //   cache: 'default',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/JSON',
    //   },
    //   body: JSON.stringify({ email, password }),
    // });

    console.log(res);
    if (res.data)
      document.cookie = `jwt=${res.data.token};max-age=${60 * 60 * 24 * 10}`;

    // console.log(res.headers);
    // console.log(await res.json());
  } catch (err) {
    // console.log(err.response.data, '😅😅😅');
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    axios.defaults.withCredentials = true;
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8080/api/v1/users/logout',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // const res = await fetch('https://127.0.0.1:8080/api/v1/users/logout', {
    //   method: 'GET',
    //   mmode: 'cors',
    //   cache: 'default',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/JSON',
    //   },
    // });
    // const data = await res.json();
    // console.log(data);
    document.cookie = `jwt=loggedOut;max-age=${1}`;
    console.log(res);
    showAlert('success', 'Logged out');
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out! Try again.');
  }
};
