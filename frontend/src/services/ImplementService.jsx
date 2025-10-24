import service from './indexService.jsx';

const ImplementService = {
  postImplement: (data) => {
    return service('/implement', {
      method: 'POST',
      body: data
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