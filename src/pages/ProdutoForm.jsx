import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    TextField, Button, Paper, Typography, Box, Checkbox, FormControlLabel,
    // 1. IMPORTA OS COMPONENTES (SELECT)
    FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';

const ProdutoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 2. CRIA ESTADOS PARA OS NOVOS CAMPOS
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [perecivel, setPerecivel] = useState(false);
    const [dataValidade, setDataValidade] = useState('');
    
    const [empresaId, setEmpresaId] = useState('');
    const [productTypeId, setProductTypeId] = useState('');
    const [status, setStatus] = useState('active'); 
    const [imagens, setImagens] = useState(''); 

    // Listas para preencher
    const [empresaOptions, setEmpresaOptions] = useState([]);
    const [productTypeOptions, setProductTypeOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. BUSCA OS DADOS PARA EDIÇÃO
    useEffect(() => {
        const fetchData = async () => {
            try {

                const [empresasRes, typesRes] = await Promise.all([
                    api.get('/v1/empresas/'),
                    api.get('/v1/product-types/')
                ]);
                setEmpresaOptions(empresasRes.data);
                setProductTypeOptions(typesRes.data);

                if (id) {
                    const produtoRes = await api.get(`/v1/produtos/${id}/`);
                    const data = produtoRes.data;
                    setNome(data.nome);
                    setCodigo(data.codigo || '');
                    setPerecivel(data.perecivel);
                    setDataValidade(data.data_validade || '');

                    const empresaObj = empresasRes.data.find(e => e.nome === data.empresa);
                    if (empresaObj) setEmpresaId(empresaObj.id);

                    const typeObj = typesRes.data.find(t => t.nome === data.product_type);
                    if (typeObj) setProductTypeId(typeObj.id);
                    
                    setStatus(data.status);
                    setImagens(data.imagens?.[0] || '');
                }
            } catch (error) {
                console.error("Falha ao carregar dados do formulário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // 4. MONTA O OBJETO DE DADOS PARA ENVIAR À API
        const produtoData = {
            nome,
            codigo,
            perecivel,
            data_validade: perecivel ? (dataValidade || null) : null,
            empresa: empresaId, // Envia o ID da empresa selecionada
            product_type: productTypeId, // Envia o ID do tipo selecionado
            status,
            imagens: imagens ? [imagens] : [], // Envia a URL como um array no JSON
        };

        try {
            if (id) {
                await api.put(`/v1/produtos/${id}/`, produtoData);
            } else {
                await api.post('/v1/produtos/', produtoData);
            }
            navigate('/produtos');
        } catch (error) {
            console.error("Falha ao salvar produto:", error.response?.data || error.message);
            // Aqui voce pode adicionar lógica pra mostrar erro pro usuário
        }
    };

    if (loading && id) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '600px' }}>
            <Typography variant="h5" gutterBottom>
                {id ? 'Editar Produto' : 'Novo Produto'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
                    {/* 5. ADICIONA OS NOVOS CAMPOS AO FORMULÁRIO */}
                    <TextField label="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <TextField label="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                    
                    <FormControl fullWidth required>
                        <InputLabel>Empresa</InputLabel>
                        <Select value={empresaId} label="Empresa" onChange={(e) => setEmpresaId(e.target.value)}>
                            {empresaOptions.map((opt) => (
                                <MenuItem key={opt.id} value={opt.id}>{opt.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel>Tipo de Produto</InputLabel>
                        <Select value={productTypeId} label="Tipo de Produto" onChange={(e) => setProductTypeId(e.target.value)}>
                            {productTypeOptions.map((opt) => (
                                <MenuItem key={opt.id} value={opt.id}>{opt.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value="active">Ativo</MenuItem>
                            <MenuItem value="inactive">Inativo</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField label="URL da Imagem" value={imagens} onChange={(e) => setImagens(e.target.value)} />

                    <FormControlLabel
                        control={<Checkbox checked={perecivel} onChange={(e) => setPerecivel(e.target.checked)} />}
                        label="Perecível"
                    />

                    {perecivel && (
                        <TextField
                            label="Data de Validade"
                            type="date"
                            value={dataValidade}
                            onChange={(e) => setDataValidade(e.target.value)}
                            required={perecivel} // Torna obrigatório apenas se perecível
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                    
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Salvar Produto
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default ProdutoForm;