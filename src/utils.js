export const translateStatus = (statusValue) => {
    // A função de tradução de status (suporta string e booleano)
    if (typeof statusValue === 'string') {
        const lowerCaseStatus = statusValue.toLowerCase();
        if (lowerCaseStatus === 'active') return 'Ativo';
        if (lowerCaseStatus === 'inactive') return 'Inativo';
    }
    if (typeof statusValue === 'boolean') {
        return statusValue ? 'Ativo' : 'Inativo';
    }
    return statusValue;
};

// 🚨 FUNÇÃO DE FORMATAÇÃO DE MOEDA (RESOLVENDO O SYNTAXERROR)
export const decimalToCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
        return 'R$ 0,00';
    }
    const numericValue = parseFloat(value);
    
    // Formatação localizada (PT-BR)
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numericValue);
};

