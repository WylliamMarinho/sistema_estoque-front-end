import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome'; 
import ProdutoList from './pages/ProdutoList';
import ProdutoForm from './pages/ProdutoForm';
import ProdutoDetail from './pages/ProdutoDetail';
import LoginForm from './pages/LoginForm';
import EmpresaList from './pages/EmpresaList'; // Novo
import EmpresaDetail from './pages/EmpresaDetail'; // Novo
import EmpresaForm from './pages/EmpresaForm'; // Novo
import ProductTypeList from './pages/ProductTypeList';
import ProductTypeForm from './pages/ProductTypeForm';
import ProductTypeDetail from './pages/ProductTypeDetail';
import EstoqueEntradaList from './pages/EstoqueEntradaList';
import EstoqueEntradaForm from './pages/EstoqueEntradaForm';

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

           {/* 🚨 ROTAS DE PRODUTOS */}
          <Route path="/produtos" element={<ProdutoList />} />
          <Route path="/produtos/novo" element={<ProdutoForm />} />
          <Route path="/produtos/editar/:id" element={<ProdutoForm />} />
          <Route path="/produtos/view/:id" element={<ProdutoDetail />} />
          
          {/* 🚨 NOVAS ROTAS DE EMPRESAS */}
          <Route path="/empresas" element={<EmpresaList />} />
          <Route path="/empresas/novo" element={<EmpresaForm />} />
          <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
          <Route path="/empresas/view/:id" element={<EmpresaDetail />} />

          {/* 🚨 2. NOVAS ROTAS DE TIPO DE PRODUTO */}
          <Route path="/product-types" element={<ProductTypeList />} />
          <Route path="/product-types/novo" element={<ProductTypeForm />} />
          <Route path="/product-types/editar/:id" element={<ProductTypeForm />} />
          <Route path="/product-types/view/:id" element={<ProductTypeDetail />} /> 

                      {/* 🚨 NOVAS ROTAS DE ENTRADA DE ESTOQUE */}
            <Route path="/entradas-estoque" element={<EstoqueEntradaList />} />
            <Route path="/entradas-estoque/novo" element={<EstoqueEntradaForm />} />
            <Route path="/entradas-estoque/editar/:id" element={<EstoqueEntradaForm />} />
            <Route path="/entradas-estoque/view/:id" element={<EstoqueEntradaList />} />
        </Route>
        
        {/* Rota de fallback*/}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
