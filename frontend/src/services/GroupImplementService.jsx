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
    return service(`/group-implements/${id}`);
  },
  getGroupImplementBySearch: (query, search) => {
    return service(`/group-implements/search?${query}=${encodeURIComponent(search)}`);
  },
  updateGroupImplement: (id, data) => {
    return service(`/group-implements/${id}`,{
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

export default GroupImplementService;