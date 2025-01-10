import { Paper, CardMedia } from '@mui/material'

type ItemProps = {
    item: string,
    key: number,
}


const Item = ({item} : ItemProps)  => 
{
    return(
        <>
            <Paper sx = {{boxShadow: 0}}>
                <CardMedia
                    component='img'
                    image = {item}
                    sx = {{width: 150, justifySelf: 'center', boxShadow: 0}}
                />
            </Paper>
        </>
    )
}

export default Item;