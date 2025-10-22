import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/v1', // Django
});

export const login = async (username, password) => {
  // OAuth2PasswordRequestForm requer x-www-form-urlencoded
  const data = { username, password };

  const response = await authApi.post('/login/', data);

  // Salva token no localStorage
  localStorage.setItem('accessToken', response.data.access_token);
  return response.data;
};
