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
import Button from "@mui/material/Button";
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PaginationOutlined from './PaginationOutlined';
import '../index.css'
import { askServerForFavePomemon } from '../api/fetchFromAPI';


const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);
    const [addedPokemon, setAddedPokemon ] = React.useState<number[]>([]);
    const SearchAPIData = apiData || {results: []};
    const currentPokemonList = apiData ? apiData.results.slice(counter, counter + 12) : [];
    const [spriteDataMap, setSpriteDataMap] = React.useState<Map<number, spriteProps>>(new Map());  
    
    React.useEffect(() => {
      fetchDataFromApi(0, setApiData, apiData, 151, setspriteData, spriteDataMap, setSpriteDataMap);
      
      const fetchFavorites = async () => {
        try {
            await askServerForFavePomemon(setAddedPokemon); // Wait for this function to complete
            console.log("Favorites loaded successfully");
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        } 
    };
    
    fetchFavorites(); // Call the async function
    console.log(addedPokemon)
    }, []);
  
   

    const handleAddToFavourites = (pokemonId: number, name: string, sprite: string, ) => {
      addToFavourites(pokemonId, name, sprite)
    
      // Optimistically update the state
      setAddedPokemon((prev) => {
        // Check if Pokémon is already in the favorites
        if (prev.includes(pokemonId)) {
            // Remove it if it exists
            return prev.filter((id) => id !== pokemonId);
        } else {
            // Add it if it doesn't exist
            return [...prev, pokemonId];
        }
    });
      
  };
    
  return (
    <>
      

      <Box sx = {{width: '100%', maxWidth: 650}}>
        <nav aria-label="main mailbox folders"></nav>
        <Box sx = {{flexGrow: 1}}>
          <Grid container spacing={1} sx = {{m: 1.5, justifyContent: 'center'}}>
              <SearchBar apiData = {SearchAPIData} spriteDataMap={spriteDataMap}/>
              {(addedPokemon.length !== 0) ? (
                <IconButton className='no-hover' sx = {{p: '5px'}}><Link to={'/Favourites'} state style={{height: 24}}><FavoriteIcon style = {{color: "red" }}/></Link></IconButton>
                ) : (<IconButton className='no-hover' sx = {{p: '5px'}}><Link to={'/Favourites'} state style={{height: 24}}><FavoriteBorderIcon style={{color: "black"}} /></Link></IconButton>)
              } 
          </Grid>
        </Box>
        <List sx={{flexGrow: 1, flexWrap: 'wrap' }}>
          <Grid container spacing={2} sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'}}>
            
              {apiData && currentPokemonList.map((info, index) => {
                
                    const pokemonId = index + counter;  // ID for the Pokémon (page-specific)
                    const sprite = spriteDataMap.get(pokemonId + 1);  // Get the sprite for the current Pokémon from the Map                    
                    return(
                      <Grid size = {{ xs: 7, sm: 4, md: 4}}>
                          <ListItem sx ={{width: '100%'}}>
                            {spriteData && (
                              <Card className="card" sx = {{alignItems: 'center',borderRadius: '8%', width: '100%'}}>
                                {addedPokemon.includes(pokemonId)? (
                                  <Box textAlign='right'><Button variant="text"><FavoriteIcon style = {{color: "red" }}/></Button></Box>): (<Box textAlign='right'><Button variant="text" onClick={()=>handleAddToFavourites(pokemonId, Object.values(info)[0] as string, sprite?.front_sprite as string)}><FavoriteBorderIcon style={{color: "black"}} /></Button></Box>)
                                }
                                  <Link className="no-hover" to={`/PokeInfo/${index + counter}`} state = {{id: index + counter, name: Object.values(info)[0] as string, sprite: sprite?.front_sprite as string, sprite_back: sprite?.back_sprite as string}}>
                                    
                                      <CardActionArea sx={{textAlign: 'center', width: '100%'}}>
                                        
                                          <CardMedia
                                            component='img'
                                            image={sprite?.front_sprite}
                                            alt={info.name}
                                            style={{width: 100, margin: 'auto'}}
                                          />
                                        <Box sx={{mb: 2}}>
                                          <Typography variant='body1' component="div" className="card-text">
                                                  PokéID: {pokemonId + 1}    
                                          </Typography>
                                          <Typography variant='body1' component="div" className="card-text">
                                                  {Object.values(info)[0] as string}    
                                          </Typography>
                                        </Box>
                                      </CardActionArea>
                                    
                                  </Link>
                                
                                
                                </Card>
                              )}
                              
                          </ListItem>
                        </Grid>)
                  }
                )}
                  
              </Grid>
            </List>
          
      </Box>
        <Box sx={{alignItems: 'center',width: '100%'}}>
          <PaginationOutlined maxValue={apiData?.results.length} setCounter={setCounter}/>
        </Box>
      
    </>
  )
}

export default PokemonList;