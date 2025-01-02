import React from 'react'
import { Link } from 'react-router-dom';
import { fetchDataFromApi, addToFavourites, apiProps, spriteProps } from '../api/fetchFromPokeAPI';
import SearchBar from './SearchBar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';      
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography'
import  CardActionArea from '@mui/material/CardActionArea';
import  CardMedia  from '@mui/material/CardMedia';
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { IconButton } from '@mui/material';

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
      <SearchBar apiData = {SearchAPIData} spriteDataMap={spriteDataMap}/>

      <Box sx = {{width: '100%', maxWidth: 360}}>
        <nav aria-label="main mailbox folders"></nav>

        <List>
          {apiData && currentPokemonList.map((info, index) => {
            const pokemonId = index + counter;  // ID for the Pokémon (page-specific)
            const sprite = spriteDataMap.get(pokemonId + 1);  // Get the sprite for the current Pokémon from the Map
            return(
              <ListItem>
                {spriteData && (
                  <Card sx = {{ maxWidth: 800, maxHeight: 345 ,borderRadius: '8%'}}>
                      <Link to={`/PokeInfo/${index + counter}`} state = {{id: index + counter, name: Object.values(info)[0] as string, sprite: sprite?.front_sprite as string, sprite_back: sprite?.back_sprite as string}}>
                      
                        <CardActionArea>
                          <CardMedia
                              component="img"
                              height="150"
                              width="150"
                              image={sprite?.front_sprite}
                              alt={info.name}
                          />
                          <Typography variant='body1' component="div">
                                  PokéID: {pokemonId + 1}    
                          </Typography>
                          <Typography variant='body1' component="div">
                                  {Object.values(info)[0] as string}    
                          </Typography>
                        </CardActionArea>
                      </Link>
                    
                    {addedPokemons.has(index)? (
                      <Typography>Pokémon added</Typography>): (<Button variant="text" onClick={()=>handleAddToFavourites(index + counter, Object.values(info)[0] as string, sprite?.front_sprite as string)}>add</Button>)
                    }
                    </Card>
                  )}
                  
              </ListItem>)
          })}
        </List>
      </Box>
      <div id = "Under-List Controler"></div>
        <ButtonGroup>
          <IconButton type="button" onClick={getPrevious} sx={{backgroundColor: 'background.paper'}} disabled={counter === 0}><NavigateBefore/></IconButton>
          <IconButton type="button" onClick={getNext} sx={{backgroundColor: 'background.paper'}} disabled={counter + 10 >= (apiData?.results.length || 0)}><NavigateNext/></IconButton>
        </ButtonGroup>
        <Button><Link to={'/Favourites'} state>Favourites</Link></Button>
      
    </>
  )
}

export default PokemonList;