import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    Authorization: `Bearer ${localStorage
      .getItem('token')
      .replace(/["]/g, '')}`,
  },
});
