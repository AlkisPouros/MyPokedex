import { Paper, CardMedia } from '@mui/material'



type ItemProps = {
    item: string,
    key: number,
}

// This is the Item component used for the carousel container-component 
// The props passed are a key a unique image indetifier for the mapping inside the carousel and the string is the image url

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