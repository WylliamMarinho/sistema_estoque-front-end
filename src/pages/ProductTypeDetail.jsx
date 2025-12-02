import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Paper, Typography, Box, Button, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';

const ProductTypeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tipoProduto, setTipoProduto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTipo = async () => {
            try {
                setLoading(true);
                // Rota GET /product-types/:id/
                const response = await api.get(`/v1/product-types/${id}/`);
                setTipoProduto(response.data);
            } catch (error) {
                console.error("Falha ao carregar detalhes do Tipo de Produto:", error);
                setTipoProduto(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTipo();
    }, [id]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    if (!tipoProduto) {
        return <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>Tipo de Produto não encontrado.</Typography>;
    }

    const TypeLABELS = {
        'nome': 'Nome do Tipo',
        'id': 'ID',
    };

    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '700px' }}>
            <Typography variant="h4" gutterBottom>
                Detalhes do Tipo de Produto
            </Typography>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                {tipoProduto.nome}
            </Typography>
            
            <List>
                {/* 1. ID */}
                <ListItem>
                    <ListItemText primary={TypeLABELS.id} secondary={tipoProduto.id} />
                </ListItem>
                <Divider />
                
                {/* 2. NOME */}
                <ListItem>
                    <ListItemText primary={TypeLABELS.nome} secondary={tipoProduto.nome} />
                </ListItem>
                <Divider />

            </List>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => navigate(`/product-types/editar/${tipoProduto.id}`)}>
                    Editar
                </Button>
                <Button variant="outlined" onClick={() => navigate('/product-types')}>
                    Voltar à Lista
                </Button>
            </Box>
        </Paper>
    );
};

export default ProductTypeDetail;