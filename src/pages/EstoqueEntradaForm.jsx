import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    TextField, Button, Paper, Typography, Box, Grid, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// 🚨 URL PRINCIPAL PARA ENTRADAS DE ESTOQUE
const ENTRADA_URL = '/v1/estoque/entradas-estoque/';
// 🚨 URL PARA BUSCAR PRODUTOS (para o dropdown de itens)
const PRODUTO_OPTIONS_URL = '/v1/produtos/'; 

const EstoqueEntradaForm = () => {
    const { id } = useParams(); // Usado para edição (ID da EntradaEstoque)
    const navigate = useNavigate();

    // 1. ESTADOS DO CABEÇALHO DA ENTRADA
    const [fornecedor, setFornecedor] = useState('');
    const [dataCompra, setDataCompra] = useState('');
    const [valorFrete, setValorFrete] = useState('');
    const [valorCompraTotal, setValorCompraTotal] = useState('');

    // 2. ESTADO DOS ITENS ANINHADOS (A lista dinâmica)
    const [itens, setItens] = useState([]); 
    
    // 3. ESTADOS AUXILIARES
    const [produtoOptions, setProdutoOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // ====================================================================
    // LÓGICA DE CARREGAMENTO (PARA EDIÇÃO E PRODUTOS)
    // ====================================================================
    useEffect(() => {
        const fetchRequiredData = async () => {
            try {
                // Busca lista de produtos (para o dropdown em CADA linha da tabela)
                const produtosRes = await api.get(PRODUTO_OPTIONS_URL);
                setProdutoOptions(produtosRes.data);

                if (id) {
                    // Se for EDIÇÃO, busca os dados da entrada existente
                    const entradaRes = await api.get(`${ENTRADA_URL}${id}/`);
                    const data = entradaRes.data;

                    setFornecedor(data.fornecedor);
                    setDataCompra(data.data_compra); // Assumindo formato YYYY-MM-DD
                    setValorFrete(data.valor_frete);
                    setValorCompraTotal(data.valor_compra_total);
                    
                    // 🚨 PREENCHE OS ITENS PARA EDIÇÃO
                    setItens(data.itens.map(item => ({
                        // Deve ter uma chave temporária para o React
                        tempId: Math.random(), 
                        ...item
                    })));
                } else {
                    // Se for CRIAÇÃO, inicializa com uma linha vazia
                    handleAddItem();
                }
            } catch (error) {
                console.error("Falha ao carregar dados:", error.response?.data || error.message);
                if (id) alert("Erro ao carregar entrada. O registro pode não existir.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequiredData();
    }, [id]);

    // ====================================================================
    // LÓGICA DE GERENCIAMENTO DE ITENS
    // ====================================================================

    // Adiciona uma nova linha vazia
    const handleAddItem = () => {
        setItens([...itens, {
            tempId: Math.random(), // Chave para o React (não é PK)
            produto: '',
            quantidade: 0,
            valor_compra_unitario: 0,
            valor_venda_vista: '',
            valor_venda_prazo: '',
        }]);
    };

    // Remove uma linha pelo tempId
    const handleRemoveItem = (tempId) => {
        setItens(itens.filter(item => item.tempId !== tempId));
    };

    // Atualiza um campo específico de um item (ex: quantidade)
    const handleItemChange = (tempId, field, value) => {
        setItens(itens.map(item => 
            item.tempId === tempId ? { ...item, [field]: value } : item
        ));
    };


    // ====================================================================
    // LÓGICA DE SUBMISSÃO (POST/PUT)
    // ====================================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 🚨 PREPARAÇÃO FINAL DO PAYLOAD ANINHADO
        const payload = {
            fornecedor,
            data_compra: dataCompra,
            // Valores precisam ser strings decimais para o Django (DecimalField)
            valor_frete: String(valorFrete), 
            valor_compra_total: String(valorCompraTotal),
            itens: itens.map(item => ({
                produto: item.produto, 
                quantidade: Number(item.quantidade),
                valor_compra_unitario: String(item.valor_compra_unitario),
                valor_venda_vista: item.valor_venda_vista ? String(item.valor_venda_vista) : null,
                valor_venda_prazo: item.valor_venda_prazo ? String(item.valor_venda_prazo) : null,
                // O valor_frete_rateado é calculado no Backend, não precisa ser enviado
            })).filter(item => item.produto && item.quantidade > 0) // Remove linhas incompletas
        };

        try {
            if (id) {
                await api.put(`${ENTRADA_URL}${id}/`, payload);
            } else {
                await api.post(ENTRADA_URL, payload);
            }
            navigate('/entradas-estoque');
        } catch (error) {
            console.error("Falha ao salvar entrada:", error.response?.data || error.message);
            alert(`Erro ao salvar: ${error.response?.data?.detail || JSON.stringify(error.response?.data)}`);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }


    // ====================================================================
    // RENDERIZAÇÃO DO FORMULÁRIO
    // ====================================================================

    return (
        <Paper elevation={3} sx={{ margin: '50px auto', padding: 4, maxWidth: '1000px' }}>
            <Typography variant="h5" gutterBottom>
                {id ? `Editar Entrada ${id}` : 'Nova Entrada de Estoque'}
            </Typography>
            <form onSubmit={handleSubmit}>
                
                {/* --- SEÇÃO CABEÇALHO --- */}
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Dados da Nota/Caminhão</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label="Fornecedor" 
                            value={fornecedor} 
                            onChange={(e) => setFornecedor(e.target.value)} 
                            required 
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label="Data da Compra" 
                            type="date"
                            value={dataCompra} 
                            onChange={(e) => setDataCompra(e.target.value)} 
                            required 
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label="Valor Total da Compra" 
                            type="number"
                            value={valorCompraTotal} 
                            onChange={(e) => setValorCompraTotal(e.target.value)} 
                            required 
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label="Valor do Frete (Para Rateio)" 
                            type="number"
                            value={valorFrete} 
                            onChange={(e) => setValorFrete(e.target.value)} 
                            required 
                            fullWidth
                        />
                    </Grid>
                </Grid>

                {/* --- SEÇÃO ITENS --- */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Itens da Entrada</Typography>
                
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '30%' }}>Produto (Obrigatório)</TableCell>
                                <TableCell>Qtd.</TableCell>
                                <TableCell>Vlr Compra Unitário</TableCell>
                                <TableCell>Vlr Venda à Vista (Opcional)</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itens.map((item) => (
                                <TableRow key={item.tempId}>
                                    {/* Campo Produto (Dropdown) */}
                                    <TableCell>
                                        <FormControl fullWidth size="small" required>
                                            <InputLabel>Produto</InputLabel>
                                            <Select
                                                value={item.produto || ''}
                                                label="Produto"
                                                onChange={(e) => handleItemChange(item.tempId, 'produto', e.target.value)}
                                            >
                                                {produtoOptions.map((opt) => (
                                                    <MenuItem key={opt.id} value={opt.id}>
                                                        {opt.nome} ({opt.codigo})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    
                                    {/* Campo Quantidade */}
                                    <TableCell sx={{ width: '10%' }}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={item.quantidade}
                                            onChange={(e) => handleItemChange(item.tempId, 'quantidade', Number(e.target.value))}
                                            required
                                        />
                                    </TableCell>
                                    
                                    {/* Campo Valor Unitário */}
                                    <TableCell sx={{ width: '15%' }}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={item.valor_compra_unitario}
                                            onChange={(e) => handleItemChange(item.tempId, 'valor_compra_unitario', Number(e.target.value))}
                                            required
                                        />
                                    </TableCell>
                                    
                                    {/* Campo Valor Venda Vista */}
                                    <TableCell sx={{ width: '15%' }}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={item.valor_venda_vista}
                                            onChange={(e) => handleItemChange(item.tempId, 'valor_venda_vista', Number(e.target.value))}
                                        />
                                    </TableCell>
                                    
                                    {/* Botão de Remover Item */}
                                    <TableCell sx={{ width: '10%' }}>
                                        <IconButton color="error" onClick={() => handleRemoveItem(item.tempId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Botão Adicionar Item */}
                <Box sx={{ mt: 2, textAlign: 'left' }}>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem}>
                        Adicionar Linha
                    </Button>
                </Box>


                {/* --- BOTÃO FINAL --- */}
                <Box sx={{ mt: 4, textAlign: 'right' }}>
                    <Button type="submit" variant="contained" color="primary" size="large">
                        {id ? 'Salvar Edição' : 'Registrar Entrada'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default EstoqueEntradaForm;