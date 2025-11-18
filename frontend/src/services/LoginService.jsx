import service from './indexService.jsx';

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // "Authorization":`Bearer ${localStorage.getItem('token')}`
};

const LoginService = {
  postLogin: (data) => {
    return service('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers
    });
  },
}

export default LoginService;