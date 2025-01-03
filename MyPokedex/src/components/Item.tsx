import React from 'react';
import { Paper, CardMedia } from '@mui/material'

type ItemProps = {
    item: string,
    key: number,
}


const Item = ({key : number, item: string} : ItemProps)  => 
{
    return(
        <Paper>
            <CardMedia
                component='img'
                image = {item}
            />
        </Paper>
    )
}

export default Item;