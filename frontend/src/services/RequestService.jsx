import service from './indexService.jsx';

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // "Authorization":`Bearer ${localStorage.getItem('token')}`
};

const RequestService = {
  postRequest: (data) => {
    return service('/request', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers
    });
  },
  getRequests: () => {
    return service('/requests');
  },
  getRequestsByIdPerson: (id) => {
    return service(`/requests/info-person/${id}`);
  },
  getStatusWhitIdInfoPerson: (id) => {
    return service(`/requests/info-person/status/${id}`);
  },
  getRequestById: (id) => {
    return service(`/request/${id}`);
  },
}

export default RequestService;