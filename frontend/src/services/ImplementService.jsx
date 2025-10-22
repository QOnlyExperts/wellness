import service from './indexService.jsx';

const ImplementService = {
  postImplement: (data) => {
    return service('/implement', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getImplements: () => {
    return service('/implements');
  },
  getImplementsByIdGroup: (id) => {
    return service(`/implements/${id}`);
  },
}

export default ImplementService;