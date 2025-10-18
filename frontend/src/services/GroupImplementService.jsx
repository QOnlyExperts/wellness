import service from './indexService.jsx';


const GroupImplementService = {
  postGroupImplement: (data) => {
    return service('/group-implement',{
      method: 'POST',
      body: data
    });
  },
  getGroupImplements: () => {
    return service('/group-implements');
  },
  // getGroupImplementById: (id) => {
  //   return service(`/group-implement/${id}`);
  // },
  // updateGroupImplement: (id, data) => {
  //   return service(`/group-implement/${id}`,{
  //     method: 'PUT',
  //     body: data
  //   });
  // }
}

export default GroupImplementService;