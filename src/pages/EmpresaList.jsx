// src/pages/EmpresaList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { translateStatus } from '../utils'; // Importa a função centralizada
import { 
    Box, TextField, Button, Paper, Typography,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';


const EmpresaList = () => {
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);

    // 1. FUNÇÃO PARA BUSCAR EMPRESAS
    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                // 🚨 CORREÇÃO AQUI: Mudança para '/v1/empresas/'
                const response = await api.get('/v1/empresas/', { params: { s: searchTerm } }); 
                setEmpresas(response.data);
            } catch (error) {
                console.error("Falha ao buscar empresas:", error);
            }
        };
        fetchEmpresas();
    }, [searchTerm]);

// 2. LÓGICA DE DELEÇÃO
    const handleDelete = async () => {
        try {
            // 🚨 CORREÇÃO AQUI: Mudança para '/v1/empresas/:id/'
            await api.delete(`/v1/empresas/${selectedEmpresaId}/`);
            setEmpresas(empresas.filter(e => e.id !== selectedEmpresaId));
            handleCloseDialog();
        } catch (error) {
            console.error("Falha ao deletar empresa:", error);
        }
    };

    const handleOpenDialog = (id) => {
        setSelectedEmpresaId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmpresaId(null);
    };
    
    // Mapeamento de rótulos para exibição (baseado no modelo Empresa)
    const EmpresaLABELS = {
        'nome': 'Nome da Empresa',
        'cnpj': 'CNPJ',
        'is_active': 'Status', // O campo no modelo Empresa é is_active
    };


    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon /> Lista de Empresas
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/empresas/novo')}>
                    Adicionar Empresa
                </Button>
            </Box>

            <TextField
                label="Buscar por Nome ou CNPJ"
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
                            <TableCell>{EmpresaLABELS.nome}</TableCell>
                            <TableCell>{EmpresaLABELS.cnpj}</TableCell>
                            <TableCell>{EmpresaLABELS.is_active}</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empresas.map((empresa) => (
                            <TableRow key={empresa.id}>
                                <TableCell>{empresa.nome}</TableCell>
                                <TableCell>{empresa.cnpj}</TableCell>
                                {/* 🚨 Aplica a tradução do status (True/False para Ativo/Inativo) */}
                                <TableCell>{translateStatus(empresa.is_active)}</TableCell> 
                                <TableCell align="right">
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/empresas/view/${empresa.id}`)}>
                                        Ver
                                    </Button>
                                    <Button sx={{ mr: 1 }} variant="outlined" size="small" onClick={() => navigate(`/empresas/editar/${empresa.id}`)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleOpenDialog(empresa.id)}>
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
                        Você tem certeza que deseja deletar esta empresa? Esta ação não pode ser desfeita.
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

export default EmpresaList;