/*eslint-disable*/
const login = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8080/api/v1/users/login', {
      method: 'POST',
      body: {
        email: 'laura@example.com',
        password: 'test1234',
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err.message, 'Hola');
  }
};

login();
