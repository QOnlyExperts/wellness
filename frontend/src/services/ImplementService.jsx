import service from './indexService.jsx';

const headers = {
  // "Content-Type": "multipart/form-data",
  Accept: "application/json",
  // "Authorization":`Bearer ${localStorage.getItem('token')}`
};

const ImplementService = {
  postImplement: (data) => {
    return service('/implements', {
      method: 'POST',
      body: data,
      headers: headers
    });
  },
  getImplements: () => {
    return service('/implements');
  },
  getImplementsByIdGroup: (id) => {
    return service(`/implements/group-implement/${id}`);
  },
}

export default ImplementService;