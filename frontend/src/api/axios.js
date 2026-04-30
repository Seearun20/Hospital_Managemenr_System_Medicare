import axios from 'axios';

const API = axios.create({
  baseURL: '/', // API Gateway
});

export default API;