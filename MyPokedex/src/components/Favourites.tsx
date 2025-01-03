import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFromAPI, pokemon } from '../api/fetchFromAPI';
import { removeFromFavourites } from '../api/removeFromFavourites';
import List from '@mui/material/List';
import  ListItem  from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography'
import  CardActionArea from '@mui/material/CardActionArea';
import  CardMedia  from '@mui/material/CardMedia';
import Button from "@mui/material/Button";
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Box from '@mui/material/Box'

const Favourites = () => {
    
    const [FavPokemon, setFavePokemon ] = React.useState<pokemon[] | null>(null);
    
    useEffect(()=> {
        fetchFromAPI(FavPokemon, setFavePokemon);
    },[])

    return (

        <>
            <List>
               {FavPokemon && FavPokemon.length === 0 && (
                <ListItem sx = {{justifyContent: 'center'}}>
                    <Box textAlign='left'>
                        <Typography p ={{pr: 1}} style={{color: "black"}}>No Pokémon Added</Typography>
                    </Box>
                </ListItem>
               )} 
               {FavPokemon && FavPokemon.map((info)=> (
                <ListItem>
                    <Card sx = {{maxWidth: 800, masHeight: 345, borderRadius: '8%', flexGrow: 1}}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="150"
                                width="150"
                                image={Object.values(info)[2] as string}
                                alt={Object.values(info)[1] as string}
                            />
                            <Box textAlign='center'>
                                <Typography variant='body1' component="div">
                                    PokéID: {Object.values(info)[0] as string}
                                </Typography>
                                <Typography variant='body1' component="div">
                                        {Object.values(info)[1] as string}    
                                </Typography>
                                
                                <Button variant="text" onClick={()=>removeFromFavourites(Object.values(info)[0] as number, setFavePokemon)}>Remove</Button>
                            </Box>
                        </CardActionArea>
                    </Card>
                </ListItem>
               ))}
            </List>
            <IconButton type='button'>
                <Link style = {{height: 24}} to="/"><KeyboardBackspaceIcon style = {{color: "blue"}} /></Link>
            </IconButton>

        </>
    )


}

export default Favourites