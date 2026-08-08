import { Box, Typography } from '@mui/material'
import React from 'react'
import logotipo from '../../assets/images/logotipo.png';

export const ImageGallery: React.FC = () => {
  return (
    <Box sx={{width: '100%', textAlign: 'center'}}>
        <Box sx={{mt: 2, mb: 4}}>
            <img src={logotipo} alt="Técnologico Kalum" style={{width: '250px', maxWidth: '90%', marginBottom: '8px'}} />
            <Typography variant='h4' sx={{ fontWeight: "bold", mt: 1}}>
                TÉCNOLOGICO KALUM
            </Typography>
        </Box>
    </Box>
  )
}
