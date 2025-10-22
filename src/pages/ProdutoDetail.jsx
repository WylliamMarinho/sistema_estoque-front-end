// src/pages/ProdutoDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Paper, Typography, Box, Button, CircularProgress, 
    List, ListItem, ListItemText, Divider 
} from '@mui/material';

const ProdutoDetail = () => {
    // Hooks para pegar o ID da URL e para navegar
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados para guardar os dados do produto e controlar o carregamento
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);

    // Efeito que busca os dados do produto na API quando o componente é montado
    useEffect(() => {
        const fetchProduto = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/v1/produtos/${id}/`);
                setProduto(response.data);
            } catch (error) {
                console.error("Falha ao buscar detalhes do produto:", error);
                setProduto(null); // Limpa o produto em caso de erro (ex: não encontrado)
            } finally {
                setLoading(false); // Garante que o loading termine, mesmo com erro
            }
        };
        fetchProduto();
    }, [id]); // Roda o efeito sempre que o 'id' na URL mudar

    // Exibe um spinner de carregamento enquanto busca os dados
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Exibe uma mensagem se o produto não for encontrado após o carregamento
    if (!produto) {
        return (
            <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '700px', textAlign: 'center' }}>
                <Typography variant="h5">Produto não encontrado.</Typography>
                <Button variant="contained" onClick={() => navigate('/produtos')} sx={{ mt: 2 }}>
                    Voltar para a Lista
                </Button>
            </Paper>
        );
    }

    // Exibe os detalhes do produto
    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '700px' }}>
            <Typography variant="h4" gutterBottom>
                Detalhes do Produto
            </Typography>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                {produto.nome}
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Empresa" secondary={produto.empresa} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Tipo de Produto" secondary={produto.product_type} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Código" secondary={produto.codigo || 'Não informado'} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Status" secondary={produto.status} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Perecível" secondary={produto.perecivel ? 'Sim' : 'Não'} />
                </ListItem>
                {produto.perecivel && (
                    <>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Data de Validade" secondary={produto.data_validade || 'Não informada'} />
                        </ListItem>
                    </>
                )}
            </List>
            <Button variant="contained" onClick={() => navigate('/produtos')} sx={{ mt: 3 }}>
                Voltar para a Lista
            </Button>
        </Paper>
    );
};

export default ProdutoDetail;