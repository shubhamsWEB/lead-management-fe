import axios from 'axios';

const apiServer = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export { apiServer };
