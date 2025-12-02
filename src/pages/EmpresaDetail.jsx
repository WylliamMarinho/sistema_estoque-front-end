// src/pages/EmpresaDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { translateStatus } from '../utils'; // Importa a função centralizada
import { 
    Paper, Typography, Box, Button, CircularProgress, 
    // Componentes de Lista
    List, ListItem, ListItemText, Divider 
} from '@mui/material';

const EmpresaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/v1/empresas/${id}/`);
                setEmpresa(response.data);
            } catch (error) {
                console.error("Falha ao carregar detalhes da empresa:", error);
                setEmpresa(null); // Limpa o objeto em caso de erro
            } finally {
                setLoading(false);
            }
        };
        fetchEmpresa();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!empresa) {
        return (
            <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '700px', textAlign: 'center' }}>
                <Typography variant="h5" color="error">Empresa não encontrada.</Typography>
                <Button variant="contained" onClick={() => navigate('/empresas')} sx={{ mt: 2 }}>
                    Voltar para a Lista
                </Button>
            </Paper>
        );
    }
    
    // Mapeamento de rótulos para exibição
    const EmpresaLABELS = {
        'nome': 'Nome',
        'cnpj': 'CNPJ',
        'is_active': 'Status',
        'id': 'ID',
    };

    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '700px' }}>
            <Typography variant="h4" gutterBottom>
                Detalhes da Empresa
            </Typography>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                {empresa.nome}
            </Typography>
            
            <List>
                {/* 1. ID */}
                <ListItem>
                    <ListItemText primary="ID" secondary={empresa.id} />
                </ListItem>
                <Divider />
                
                {/* 2. CNPJ */}
                <ListItem>
                    <ListItemText primary="CNPJ" secondary={empresa.cnpj || 'Não informado'} />
                </ListItem>
                <Divider />
                
                {/* 3. STATUS (com tradução) */}
                <ListItem>
                    <ListItemText primary="Status" secondary={translateStatus(empresa.is_active)} />
                </ListItem>
                <Divider />
                
                {/* 4. DATA DE CRIAÇÃO (Se seu modelo EntradaEstoque tivesse um campo) 
                <ListItem>
                    <ListItemText primary="Criada em" secondary={empresa.data_criacao ? new Date(empresa.data_criacao).toLocaleDateString() : 'N/A'} />
                </ListItem> 
                <Divider /> */}

            </List>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => navigate(`/empresas/editar/${empresa.id}`)}>
                    Editar
                </Button>
                <Button variant="outlined" onClick={() => navigate('/empresas')}>
                    Voltar para a Lista
                </Button>
            </Box>
        </Paper>
    );
};

export default EmpresaDetail;