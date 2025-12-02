// src/utils.js

export const translateStatus = (statusValue) => {
    // 🚨 Esta função lida com 'active'/'inactive' (string) ou True/False (boolean)
    if (typeof statusValue === 'string') {
        const lowerCaseStatus = statusValue.toLowerCase();
        if (lowerCaseStatus === 'active') return 'Ativo';
        if (lowerCaseStatus === 'inactive') return 'Inativo';
    }
    // Para BooleanField (is_active: True/False)
    if (typeof statusValue === 'boolean') {
        return statusValue ? 'Ativo' : 'Inativo';
    }
    return statusValue;
};