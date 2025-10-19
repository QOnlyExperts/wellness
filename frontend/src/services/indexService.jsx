
let globalShowError = null;

export const setGlobalErrorHandler = (handler) => {
  globalShowError = handler;
};


const service = async (url, options = {}) => {

  options.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // "Authorization":`Bearer ${localStorage.getItem('token')}`
  };

  try {
    const response = await fetch(`http://localhost:4000/api/v1${url}`, options);
    const res = await response.json();

    // if (!res.ok && (res.status === 401 || res?.error?.name === 'TokenExpiredError')) {
    //   // if () {
    //     // console.log(res.error.name)
    //     if (globalShowError) {
    //       globalShowError('Sesión expirada. Por favor, inicie sesión de nuevo.');
    //       return;
    //     }
    //   // }
    // }

    console.log(res);
    
    return res;

  } catch (e) {
    console.error(e);
  }
};


export default service;