import axios from 'axios';

// Instancia pra chamada do Django
const apiDjango = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Django
});

// Interceptor para enviar o token em todas as requisições
apiDjango.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiDjango;
