import service from './indexService.jsx';

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // "Authorization":`Bearer ${localStorage.getItem('token')}`
};

const UserService = {
  postUser: (data) => {
    return service('/user', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers
    });
  },
  getUsers: () => {
    return service('/users');
  },
  getUserById: (id) => {
    return service(`/user/${id}`);
  },
}

export default UserService;