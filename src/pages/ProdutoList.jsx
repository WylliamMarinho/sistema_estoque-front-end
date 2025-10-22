// src/pages/ProdutoList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, TextField, Box,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

const ProdutoList = () => {
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Estados para controlar o diálogo de deleção
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Lógica para buscar os produtos (já inclui a busca)
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await api.get('/v1/produtos/', { params: { s: searchTerm } });
                setProdutos(response.data);
            } catch (error) {
                console.error("Falha ao buscar produtos:", error);
            }
        };
        fetchProdutos();
    }, [searchTerm]);

    // Lógica de deleção
    const handleDelete = async () => {
        try {
            await api.delete(`/v1/produtos/${selectedProductId}/`);
            setProdutos(produtos.filter(p => p.id !== selectedProductId));
            handleCloseDialog();
        } catch (error) {
            console.error("Falha ao deletar produto:", error);
        }
    };

    const handleOpenDialog = (id) => {
        setSelectedProductId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductId(null);
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Cabeçalho e botão de Adicionar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Lista de Produtos</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/produtos/novo')}>
                    Adicionar Produto
                </Button>
            </Box>

            {/* Campo de Busca */}
            <TextField
                label="Buscar por Código ou Nome"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            {/* Tabela de Produtos */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        {/* 1. ATUALIZE OS CABEÇALHOS DA TABELA */}
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Empresa</TableCell>
                            <TableCell>Tipo de Produto</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {produtos.map((produto) => (
                            <TableRow key={produto.id}>
                                {/* 2. ATUALIZE AS CÉLULAS PARA MOSTRAR OS NOVOS DADOS */}
                                <TableCell>{produto.nome}</TableCell>
                                <TableCell>{produto.empresa}</TableCell> {/* Mostra o nome! */}
                                <TableCell>{produto.product_type}</TableCell> {/* Mostra o nome! */}
                                <TableCell>{produto.status}</TableCell>
                                <TableCell align="right">
                                    {/* 3. ADICIONE O BOTÃO DE VISUALIZAR */}
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/produtos/view/${produto.id}`)}>
                                        Ver
                                    </Button>
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/produtos/editar/${produto.id}`)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleOpenDialog(produto.id)}>
                                        Deletar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo de Confirmação de Deleção */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Deleção</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProdutoList;