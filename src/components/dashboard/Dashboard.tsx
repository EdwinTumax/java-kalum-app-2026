import { SearchOutlined } from '@mui/icons-material'
import { Button, Grid, TextField, Typography } from '@mui/material'

import React from 'react'
import { ImageGallery } from './ImageGallery'

export const Dashboard: React.FC = () => {

    return (
        
        <Grid container sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", mb:1}}>
            <ImageGallery/>
            <Grid>
                <Typography sx={{ml:4, mr:4}}>Carreras Técnicas</Typography>
            </Grid>
            <Grid>
                <Button color='primary' sx={{padding:2}}>
                    <SearchOutlined sx={{fontSize: 30, mr:2}}></SearchOutlined>
                    Buscar
                </Button>
            </Grid>
            <Grid container size={12}>
                <TextField type='text' variant='filled' fullWidth placeholder='Ingrese carrera técnica' label='carreras' sx={{border: 'none', ml:4, mr:4}}/>
            </Grid>
        </Grid>
     )
}


