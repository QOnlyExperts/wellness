import service from './indexService.jsx';

const headers = {
  // "Content-Type": "application/json",
  Accept: "application/json",
  // "Authorization":`Bearer ${localStorage.getItem('token')}`
};

const UserService = {
  postUser: (data) => {
    return service('/user', {
      method: 'POST',
      body: data,
      headers: headers
    });
  },
}

export default UserService;