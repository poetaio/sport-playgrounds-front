import axios from 'axios';
// import { customLocalStorage } from '../utils/localStorage';


const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

const authInterceptor = config => {
  // config.headers.Authorization = `Bearer ${customLocalStorage.getAuthToken()}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}
