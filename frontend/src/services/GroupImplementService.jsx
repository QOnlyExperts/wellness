import service from './indexService.jsx';


const GroupImplementService = {
  postGroupImplement: (data) => {
    return service('/group-implements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getGroupImplements: () => {
    return service('/group-implements');
  },
  getGroupImplementById: (id) => {
    return service(`/group-implement/${id}`);
  },
  updateGroupImplement: (id, data) => {
    return service(`/group-implement/${id}`,{
      method: 'PUT',
      body: data
    });
  }
}

export default GroupImplementService;