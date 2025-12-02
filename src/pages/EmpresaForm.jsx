// src/pages/EmpresaForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { translateStatus } from '../utils'; // Para exibir o status de forma amigável
import {
    TextField, Button, Paper, Typography, Box, FormControlLabel,
    // Componentes MUI
    FormControl, InputLabel, Select, MenuItem, CircularProgress,
} from '@mui/material';

const EmpresaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. ESTADOS DA EMPRESA
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    // O status é um booleano no backend (is_active: True/False)
    const [isActive, setIsActive] = useState(true); 
    
    const [loading, setLoading] = useState(true);

    // 2. BUSCA OS DADOS PARA EDIÇÃO (GET /empresas/:id/)
    useEffect(() => {
        const fetchData = async () => {
            // Se for rota de CRIAÇÃO (id está vazio), apenas termina o loading
            if (!id) {
                setLoading(false);
                return; 
            }
            
            // Se for rota de EDIÇÃO (id existe), busca os dados
            try {
                setLoading(true);
                // 🚨 CORREÇÃO DE URL: Já verificamos que o /v1/ é necessário.
                const empresaRes = await api.get(`/v1/empresas/${id}/`); 
                const data = empresaRes.data;
                
                // 🚨 GARANTIA DE PREENCHIMENTO:
                setNome(data.nome);
                setCnpj(data.cnpj || '');
                // is_active é um booleano, e o valor do backend deve ser usado diretamente
                setIsActive(data.is_active); 

            } catch (error) {
                console.error("Falha ao carregar dados da empresa:", error.response || error);
                // Em caso de falha (ex: 404), redireciona ou limpa o formulário
                alert("Erro ao carregar dados da empresa. O registro pode não existir.");
                navigate('/empresas');
                
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // 3. MONTA O OBJETO DE DADOS PARA ENVIAR À API
        const empresaData = {
            nome,
            cnpj,
            is_active: isActive, // Envia o booleano True/False
        };

        try {
            if (id) {
                // 🚨 CORREÇÃO AQUI: Mudança para '/v1/empresas/:id/' (PUT)
                await api.put(`/v1/empresas/${id}/`, empresaData);
            } else {
                // 🚨 CORREÇÃO AQUI: Mudança para '/v1/empresas/' (POST)
                await api.post('/v1/empresas/', empresaData);
            }
            navigate('/empresas');
        } catch (error) {
            console.error("Falha ao salvar empresa:", error.response?.data || error.message);
            alert(`Erro ao salvar: ${error.response?.data?.nome || 'Verifique o CNPJ ou campos obrigatórios.'}`);
        }
    };

    if (loading && id) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '600px' }}>
            <Typography variant="h5" gutterBottom>
                {id ? 'Editar Empresa' : 'Nova Empresa'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
                    
                    {/* Campo Nome */}
                    <TextField label="Nome da Empresa" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    
                    {/* Campo CNPJ */}
                    <TextField label="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                    
                    {/* Campo Status (is_active) - Usando SELECT para Ativo/Inativo */}
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        {/* 🚨 O valor é um BOOLEANO, mas a exibição é string */}
                        <Select 
                            value={isActive} 
                            label="Status" 
                            onChange={(e) => setIsActive(e.target.value)}
                        >
                            {/* O valor (value) deve ser o booleano True/False */}
                            <MenuItem value={true}>Ativo</MenuItem> 
                            <MenuItem value={false}>Inativo</MenuItem>
                        </Select>
                    </FormControl>

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Salvar Empresa
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default EmpresaForm;