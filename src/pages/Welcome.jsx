import React from 'react';
import { Box, Typography } from '@mui/material';

const Welcome = () => {
    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh', // Ocupa a maior parte da altura da tela
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Bem-vindo ao Sistema de Estoque!
            </Typography>
            <Typography variant="body1">
                Selecione uma opção no menu lateral para começar.
            </Typography>
        </Box>
    );
};

export default Welcome;