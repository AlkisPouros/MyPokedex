import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getPokeDescription, speciesData } from '../api/fetchFromPokeAPI';
import Item from './Item';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Carousel from 'react-material-ui-carousel'

const PokeInfo = () => {

    const location = useLocation();
    const { id, name, sprite, sprite_back } = location.state || {};
    const [PokespeciesData, setPokeSpeciesData] = React.useState<speciesData | null>(null);
    const data = [sprite, sprite_back];


    React.useEffect(() => {
        getPokeDescription(id as number, setPokeSpeciesData);
    }, []);
    
    // Retrieving the first flavor text in English
    const getFirstFlavorText = () => {
        if (PokespeciesData?.flavor_text_entries) {
        // Find the first entry with language 'en'
        const firstEntry = PokespeciesData.flavor_text_entries.find(
            (entry) => entry.language.name === 'en'
        );
            return firstEntry?.flavor_text.replace(/\f/g," ");
        }
            return null; 
        };

    return(

        <>
            {}
                <Card className = "Info-Card" sx = {{ width: '50%', borderRadius: '8%', m: 'auto', boxShadow: 3,}}>
                    <Box sx = {{flexGrow: 1, justifyContent: 'center',}}>
                        <Grid container spacing={2}>
                            <Carousel className = "Info-Carousel" sx = {{width: '100%', m: 'auto'}} navButtonsAlwaysVisible>
                                    {
                                        data.map( (item, i) => <Item key={i} item={item as string} /> )
                                    }
                            </Carousel>
                            </Grid>
                        <Box sx= {{mt: 1}}>
                            <Typography className='Info-Text' gutterBottom variant='h5' component="div">
                                    PokéID: {id as number}    
                            </Typography>
                            <Typography className='Info-Text' gutterBottom variant='h5' component="div">
                                    {name.toUpperCase()}    
                            </Typography>
                        </Box>
                        <CardContent className='Card-Content'>
                                {getFirstFlavorText() ? (<Typography variant="body2" style = {{textWrap: 'wrap'}} sx ={{wordBreak: "break-word",color: 'text.secondary'}}>
                                    {getFirstFlavorText()}</Typography>) : (
                                        <Typography variant="body2" sx ={{color: 'text.secondary'}}>
                                            No english description available
                                        </Typography>
                                )}
                        </CardContent>
                    </Box>

                </Card>
                <Button className='Routing-button' sx = {{m: 2, backgroundColor: 'black'}} variant="text"><Link style = {{height: 24}} to="/"><KeyboardBackspaceIcon style={{color: 'white'}}/></Link> </Button>
        </>
    )
}


export default PokeInfo;