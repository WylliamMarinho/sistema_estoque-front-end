import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
// A função decimalToCurrency já está importada
import { 
    Box, TextField, Button, Paper, Typography,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { decimalToCurrency } from '../utils'; // Assumindo uma função utilitária para formatação


const EstoqueEntradaList = () => {
    const [entradas, setEntradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntradaId, setSelectedEntradaId] = useState(null);
    
    // Funções de Diálogo (Deleção)
    const handleOpenDialog = (id) => {
        setSelectedEntradaId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEntradaId(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/v1/estoque/entradas-estoque/${selectedEntradaId}/`);
            setEntradas(entradas.filter(e => e.id !== selectedEntradaId));
            handleCloseDialog();
        } catch (error) {
            console.error("Falha ao deletar entrada:", error);
            alert("Erro ao deletar entrada. Tente novamente.");
        }
    };


    // Lógica para buscar as Entradas
    useEffect(() => {
        const fetchEntradas = async () => {
            try {
                setLoading(true);
                // Rota de listagem
                const response = await api.get('/v1/estoque/entradas-estoque/', { params: { search: searchTerm } }); 
                setEntradas(response.data);
            } catch (error) {
                console.error("Falha ao buscar entradas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntradas();
    }, [searchTerm]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon /> Entradas de Estoque
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/entradas-estoque/novo')}>
                    Nova Entrada
                </Button>
            </Box>

            <TextField
                label="Buscar por Fornecedor"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fornecedor</TableCell>
                            <TableCell>Data da Compra</TableCell>
                            <TableCell>Valor Total Compra</TableCell>
                            <TableCell>Valor Frete</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entradas.map((entrada) => (
                            <TableRow key={entrada.id}>
                                <TableCell>{entrada.fornecedor}</TableCell>
                                <TableCell>{entrada.data_compra}</TableCell>
                                {/* 🚨 APLICAÇÃO DA FORMATAÇÃO NA COMPRA TOTAL */}
                                <TableCell>{decimalToCurrency(entrada.valor_compra_total)}</TableCell>
                                {/* 🚨 APLICAÇÃO DA FORMATAÇÃO NO FRETE */}
                                <TableCell>{decimalToCurrency(entrada.valor_frete)}</TableCell>
                                <TableCell align="right">
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/entradas-estoque/editar/${entrada.id}`)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleOpenDialog(entrada.id)}>
                                        Deletar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmação de Deleção */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Deleção</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você tem certeza que deseja deletar esta Entrada de Estoque?
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

export default EstoqueEntradaList;