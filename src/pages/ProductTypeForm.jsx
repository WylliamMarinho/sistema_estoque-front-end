import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    TextField, Button, Paper, Typography, Box, CircularProgress 
} from '@mui/material';

const ProductTypeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(true);

    // BUSCA OS DADOS PARA EDIÇÃO (GET /product-types/:id/)
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const tipoRes = await api.get(`/v1/product-types/${id}/`);
                    const data = tipoRes.data;
                    setNome(data.nome);
                }
            } catch (error) {
                console.error("Falha ao carregar dados do Tipo de Produto:", error);
                if (id) alert("Erro ao carregar dados. O registro pode não existir.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const tipoData = { nome };

        try {
            if (id) {
                // Requisição PUT para edição
                await api.put(`/v1/product-types/${id}/`, tipoData);
            } else {
                // Requisição POST para criação
                await api.post('/v1/product-types/', tipoData);
            }
            navigate('/product-types');
        } catch (error) {
            console.error("Falha ao salvar Tipo de Produto:", error.response?.data || error.message);
            alert(`Erro ao salvar: ${error.response?.data?.nome || 'Verifique o nome.'}`);
        }
    };

    if (loading && id) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '600px' }}>
            <Typography variant="h5" gutterBottom>
                {id ? 'Editar Tipo de Produto' : 'Novo Tipo de Produto'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
                    
                    <TextField 
                        label="Nome do Tipo" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        required 
                    />
                    
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Salvar Tipo
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default ProductTypeForm;