import React from 'react'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, addToFavourites, apiProps, spriteProps, Pokemon } from '../api/fetchFromPokeAPI';
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
import { askServerForFavePomemon } from '../api/fetchFromAPI';
import '../index.css'

const PokemonList = () => {
    const [apiData, setApiData] = React.useState<apiProps | null>(null);
    const [spriteData, setspriteData] = React.useState<spriteProps | null>(null);
    const [counter, setCounter] = React.useState<number>(0);
    const [addedPokemon, setAddedPokemon ] = React.useState<number[]>([]);
    const SearchAPIData = apiData || {results: []};
    const [spriteDataMap, setSpriteDataMap] = React.useState<Map<number, spriteProps>>(new Map());  
    const [ filteredPokemon, setFilteredPokemon ] = React.useState<Pokemon[]>([]);
    const [ pokeNameDataMap, setPokeNameDataMap ] = React.useState<Map<number,string>>(new Map());
    const [filterOffset, setFilterOffset] = React.useState<number>(0);

    React.useEffect(() => {
      const fetchData = async () => {
        try {
          await fetchDataFromApi(0, setApiData, apiData, 151, setspriteData, spriteDataMap, setSpriteDataMap, pokeNameDataMap, setPokeNameDataMap);
        }catch(error)
        {
          console.log("error",error);

        }
   
     }
      const fetchFavorites = async () => {
        try {
            await askServerForFavePomemon(setAddedPokemon); 
            console.log("Favorites loaded successfully"); 
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        }
        
    };
      fetchData();
      fetchFavorites(); // Call the async function
    }, [])
    
  
    console.log(counter);
    console.log(filterOffset)
    

  const handleDataFromSearchBar = (searchBarData: (Pokemon & { id: number; name?: string ;sprite?: spriteProps })[]) => {
      setFilteredPokemon(searchBarData);
      setFilterOffset(0); 
      setCounter(0);
    };

    console.log(filteredPokemon);
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
              <SearchBar  apiData = {SearchAPIData} spriteDataMap={spriteDataMap} onPokemonData={handleDataFromSearchBar} pokeNameDataMap={pokeNameDataMap}/>
              {(addedPokemon.length !== 0) ? (
                <IconButton className='no-hover' sx = {{borderRadius: '5px', backgroundColor: 'black', p: '5px'}}><Link to={'/Favourites'} style={{height: 24}}><FavoriteIcon style = {{color: "red" }}/></Link></IconButton>
                ) : (<IconButton className='no-hover' sx = {{borderRadius: '5px', p: '5px', backgroundColor: 'black'}}><Link to={'/Favourites'} state style={{height: 24}}><FavoriteIcon style={{color: "white"}} /></Link></IconButton>)
              } 
          </Grid>
        </Box>
        
            <List sx={{flexGrow: 1, flexWrap: 'wrap' }}>
              <Grid container spacing={2} sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%'}} size={{xs: 5}}>
                      
                      {(apiData?.results && filteredPokemon.length > 0 ? filteredPokemon : apiData?.results || [])
                        .slice(counter, counter + 12) // Use `counter` for both cases
                        .map((info, index) => {
                          const pokemonId = filteredPokemon.length > 0 
                            ? parseInt(filteredPokemon[counter + index].url.split("/")[6],10) 
                            : parseInt(info.url.split("/")[6],10);

                          const sprite = spriteDataMap.get(pokemonId);
                          const pokeName = pokeNameDataMap.get(pokemonId);
                          
                            return (
                              <Grid key={pokemonId} size={{ xs: 6, sm: 4, md: 4 }}>
                                <ListItem sx={{ width: '100%' }}>
                                  {spriteData && (
                                    <Card className="card" sx={{ alignItems: 'center', borderRadius: '8%', width: '100%' }}>
                                      {addedPokemon.includes(pokemonId) ? (
                                        <Box textAlign='right'>
                                          <Button variant="text">
                                            <FavoriteIcon style={{ color: "red" }} />
                                          </Button>
                                        </Box>
                                      ) : (
                                        <Box textAlign='right'>
                                          <Button variant="text" onClick={() => handleAddToFavourites(
                                            pokemonId,
                                            pokeName || '',
                                            sprite?.front_sprite || ''
                                          )}>
                                            <FavoriteBorderIcon style={{ color: "black" }} />
                                          </Button>
                                        </Box>
                                      )}
                                      <Link
                                        className="no-hover"
                                        to={`/PokeInfo/${pokemonId}`}
                                        state={{
                                          id: pokemonId,
                                          name: pokeName || '',
                                          sprite: sprite?.front_sprite || '',
                                          sprite_back: sprite?.back_sprite || ''
                                        }}
                                      >
                                        <CardActionArea sx={{ textAlign: 'center', width: '100%' }}>
                                          <CardMedia
                                            component='img'
                                            image={sprite?.front_sprite}
                                            alt={info.name}
                                            style={{ width: 100, margin: 'auto' }}
                                          />
                                          <Box sx={{ mb: 2 }}>
                                            <Typography variant='body1' component="div" className="card-text">
                                              PokéID: {pokemonId}
                                            </Typography>
                                            <Typography variant='body1' component="div" className="card-text">
                                              {pokeName?.toUpperCase()}
                                            </Typography>
                                          </Box>
                                        </CardActionArea>
                                      </Link>
                                    </Card>
                                  )}
                            </ListItem>
                      </Grid>
                  );
                })}
                      
              </Grid>
            </List>
          
      </Box>
        <Box sx={{alignItems: 'center',width: '100%'}}>
          <PaginationOutlined maxValue={apiData?.results.length} setCounter={setCounter} FilteredPokemonArraymaxLength={filteredPokemon.length}/>
        </Box>
      
    </>
  )
}

export default PokemonList;