import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Box, TextField, Button, Paper, Typography,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';

// Mapeamento de rótulos para exibição
const TYPE_LABELS = {
    'nome': 'Nome do Tipo',
    'id': 'ID',
};

const ProductTypeList = () => {
    const [tipos, setTipos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTypeId, setSelectedTypeId] = useState(null);

    // 1. FUNÇÃO PARA BUSCAR TIPOS DE PRODUTO
    useEffect(() => {
        const fetchTipos = async () => {
            try {
                // Endpoint já criado no core/views.py
                const response = await api.get('/v1/product-types/', { params: { s: searchTerm } }); 
                setTipos(response.data);
            } catch (error) {
                console.error("Falha ao buscar tipos de produto:", error);
            }
        };
        fetchTipos();
    }, [searchTerm]);

    // 2. LÓGICA DE DELEÇÃO
    const handleDelete = async () => {
        try {
            await api.delete(`/v1/product-types/${selectedTypeId}/`);
            setTipos(tipos.filter(t => t.id !== selectedTypeId));
            handleCloseDialog();
        } catch (error) {
            console.error("Falha ao deletar tipo de produto:", error);
            alert("Erro ao deletar: Verifique se existem produtos vinculados.");
        }
    };

    const handleOpenDialog = (id) => {
        setSelectedTypeId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTypeId(null);
    };
    

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon /> Lista de Tipos de Produto
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/product-types/novo')}>
                    Adicionar Tipo
                </Button>
            </Box>

            <TextField
                label="Buscar por Nome"
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
                            <TableCell>{TYPE_LABELS.nome}</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tipos.map((tipo) => (
                            <TableRow key={tipo.id}>
                                <TableCell>{tipo.nome}</TableCell>
                                <TableCell align="right">
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/product-types/view/${tipo.id}`)}>
                                        Ver
                                    </Button>
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/product-types/editar/${tipo.id}`)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleOpenDialog(tipo.id)}>
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
                        Você tem certeza que deseja deletar este Tipo de Produto? Esta ação não pode ser desfeita.
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

export default ProductTypeList;