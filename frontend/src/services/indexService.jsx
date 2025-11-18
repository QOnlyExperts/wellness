const apiUrl = import.meta.env.VITE_API_URL;

let globalShowError = null;

export const setGlobalErrorHandler = (handler) => {
  globalShowError = handler;
};


const service = async (url, options = {}) => {

  try {

    console.log(options)
    const response = await fetch(`${apiUrl}:4000/api/v1${url}`, options);
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