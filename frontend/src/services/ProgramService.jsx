import service from './indexService.jsx';

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // "Authorization":`Bearer ${localStorage.getItem('token')}`
};

const ProgramService = {
  getPrograms: () => {
    return service('/programs');
  },
}

export default ProgramService;