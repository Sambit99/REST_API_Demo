/*eslint-disable*/
// const catchAsync = require('./../../utils/catchAsync');

// import axios from 'axios';

const login = async (email, password) => {
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
      alert(`Logged in successfully`);
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
    alert(err.response.data.message);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Button clicked');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
