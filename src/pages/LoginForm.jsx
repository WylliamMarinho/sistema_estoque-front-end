import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import apiDjango from '../services/api';


import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await login(username, password);
      
      console.log('Login Bem-Sucedido! Resposta do servidor:', response); // <--- DEBUG 1
      
      navigate('/produtos');
      
    } catch (err) {
      console.error('O Axios lançou este erro:', err); // <--- DEBUG 2
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <Paper elevation={3} style={{ margin: '50px auto', padding: '30px', maxWidth: '400px' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default LoginForm;
