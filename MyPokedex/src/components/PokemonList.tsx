import React from 'react'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, addToFavourites, apiProps, spriteProps } from '../api/fetchFromPokeAPI';
import SearchBar from './SearchBar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';      
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2'
import FavoriteIcon from '@mui/icons-material/Favorite';


const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);
    const [addedPokemons, setAddedPokemons] = React.useState<Set<number>>(new Set()); 
    const SearchAPIData = apiData || {results: []};
    const currentPokemonList = apiData ? apiData.results.slice(counter, counter + 10) : [];
    const [spriteDataMap, setSpriteDataMap] = React.useState<Map<number, spriteProps>>(new Map());  

    React.useEffect(() => {
        fetchDataFromApi(0, setApiData, apiData, 151, setspriteData, spriteDataMap, setSpriteDataMap);
      }, []);

    
    // Handle pagination: diaplay next 10 Pokemon 
    const getNext = ()=>  {
      setCounter(prevCounter => prevCounter + 10);  // Increment counter by 10
    };
      
    // Handle pagination: display previous 10 Pokemon
    const getPrevious = () => {
      setCounter(prevCounter => prevCounter - 10);  // Decrement counter by 10
    };

    const handleAddToFavourites = (index: number, name: string, sprite: string) => {
      addToFavourites(index, name, sprite, setAddedPokemons);
      console.log("heloo there")
    };
    
  return (
    <>
      

      <Box sx = {{width: '100%', maxWidth: 650}}>
        <nav aria-label="main mailbox folders"></nav>
        <Box sx = {{flexGrow: 1}}>
          <Grid container spacing={1} sx = {{m: 1.5, justifyContent: 'center'}}>
              <SearchBar apiData = {SearchAPIData} spriteDataMap={spriteDataMap}/>
              <IconButton sx = {{p: '5px'}}><Link to={'/Favourites'} state style={{height: 24}}><FavoriteIcon style = {{color: "red" }}/></Link></IconButton>
          </Grid>
        </Box>
        <List sx={{flexGrow: 1, flexWrap: 'wrap' }}>
          <Grid container spacing={2} >
              {apiData && currentPokemonList.map((info, index) => {
                
                    const pokemonId = index + counter;  // ID for the Pokémon (page-specific)
                    const sprite = spriteDataMap.get(pokemonId + 1);  // Get the sprite for the current Pokémon from the Map
                    return(
                      <Grid size = {{xs: 7, md: 4}}>
                          <ListItem>
                            {spriteData && (
                              <Card sx = {{ alignItems: 'center',borderRadius: '8%', width: '100%'}}>
                                {addedPokemons.has(pokemonId)? (
                                  <Box textAlign='right'><FavoriteIcon style = {{color: "red" }}/></Box>): (<Box textAlign='right'><Button variant="text" onClick={()=>handleAddToFavourites(pokemonId, Object.values(info)[0] as string, sprite?.front_sprite as string)}>add</Button></Box>)
                                }
                                  <Link to={`/PokeInfo/${index + counter}`} state = {{id: index + counter, name: Object.values(info)[0] as string, sprite: sprite?.front_sprite as string, sprite_back: sprite?.back_sprite as string}}>
                                    
                                      <CardActionArea sx={{textAlign: 'center', width: '100%'}}>
                                        
                                          <CardMedia
                                            component='img'
                                            image={sprite?.front_sprite}
                                            alt={info.name}
                                            style={{width: 100, margin: 'auto'}}
                                          />
                                        <Box sx={{mb: 2}}>
                                          <Typography variant='body1' component="div">
                                                  PokéID: {pokemonId + 1}    
                                          </Typography>
                                          <Typography variant='body1' component="div">
                                                  {Object.values(info)[0] as string}    
                                          </Typography>
                                        </Box>
                                      </CardActionArea>
                                    
                                  </Link>
                                
                                
                                </Card>
                              )}
                              
                          </ListItem>
                        </Grid>)
                  })}
                  
              </Grid>
            </List>
          
      </Box>
        <ButtonGroup>
          <IconButton type="button" onClick={getPrevious} sx={{backgroundColor: 'background.paper'}} disabled={counter === 0}><NavigateBefore/></IconButton>
          <IconButton type="button" onClick={getNext} sx={{backgroundColor: 'background.paper'}} disabled={counter + 10 >= (apiData?.results.length || 0)}><NavigateNext/></IconButton>
        </ButtonGroup>
      
    </>
  )
}

export default PokemonList;