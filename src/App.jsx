import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Imports dos componentes
import Layout from './components/Layout';
import Welcome from './pages/Welcome'; 
import ProdutoList from './pages/ProdutoList';
import ProdutoForm from './pages/ProdutoForm';
import ProdutoDetail from './pages/ProdutoDetail';
import LoginForm from './pages/LoginForm';

// Função pra verificar se o usuário tá logado
const isAuthenticated = () => !!localStorage.getItem('accessToken');

// Componente pra proteger o acesso ao Layout
const ProtectedLayout = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return <Layout />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* 3. ROTAS PROTEGIDAS DENTRO DO LAYOUT */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/produtos" element={<ProdutoList />} />
          <Route path="/produtos/novo" element={<ProdutoForm />} />
          <Route path="/produtos/editar/:id" element={<ProdutoForm />} />
          <Route path="/produtos/view/:id" element={<ProdutoDetail />} />
          {/* Espaço pra add mais rotas*/}
        </Route>
        
        {/* Rota de fallback*/}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
