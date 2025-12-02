import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verifica se existe um token de acesso no localStorage
  const token = localStorage.getItem('accessToken');

  // Se o token existir, renderiza a página que o usuário pediu (usando <Outlet />)
  // Se não existir, redireciona o usuário para a página de login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;