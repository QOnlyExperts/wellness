import service from './indexService.jsx';

const headers = {
  // "Content-Type": "application/json",
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
  updateManyImplements: (data) => {
    return service('/implements/batch', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: headers
    });
  },
  getImplements: () => {
    return service('/implements');
  },
  getImplementsByIdGroup: (id) => {
    return service(`/implements/group-implement/${id}`);
  },
  getImplementsByStatus: (status) => {
    return service(`/implements/status/${status}`);
  },
}

export default ImplementService;