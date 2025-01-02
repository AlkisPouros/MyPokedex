import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getPokeDescription, speciesData } from '../api/fetchFromPokeAPI';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import  CardActionArea from '@mui/material/CardActionArea';
import  CardMedia  from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const PokeInfo = () => {

    const location = useLocation();
    const { id, name, sprite, sprite_back } = location.state || {};
    const [PokespeciesData, setPokeSpeciesData] = React.useState<speciesData | null>(null);
   
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
            return firstEntry?.flavor_text;
        }
            return null;
        };

    return(

        <>
        <Card sx = {{ maxWidth: 345, borderRadius: '8%' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={sprite}
                    alt={name}
                />
                <CardMedia
                    component="img"
                    height="140"
                    image={sprite_back}
                    alt={name}
                />
                <Typography gutterBottom variant='h5' component="div">
                        PokéID: {id + 1}    
                </Typography>
                <Typography gutterBottom variant='h5' component="div">
                        name: {name}    
                </Typography>
                <CardContent>
                    {getFirstFlavorText() ? (<Typography variant="body2" sx ={{color: 'text.secondary'}}>
                        {getFirstFlavorText()}</Typography>) : (
                            <Typography variant="body2" sx ={{color: 'text.secondary'}}>
                                No english description available
                            </Typography>
                    )}
                </CardContent>
            </CardActionArea>

        </Card>
        <Button variant="text"><Link to="/">Back</Link> </Button>
        </>
    )
}


export default PokeInfo;