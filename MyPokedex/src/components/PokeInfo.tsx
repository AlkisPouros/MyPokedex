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
import toast from 'react-hot-toast'
import { Skeleton } from '@mui/material';

 
const PokeInfo = () => {

    const location = useLocation();
    const { id, name, sprite, sprite_back } = location.state || {};
    const [ isLoading, setIsLoading ] = React.useState(false);
    const [ flavorText, setFlavorText ] = React.useState<string | null>(null);
    const data = [sprite, sprite_back];


    const fetchText = React.useCallback(async ()=> {        
        
        try {
            const data = await getPokeDescription(id as number) as unknown as speciesData | null;
            console.log(data)
            if (data?.flavor_text_entries) {
                const firstEntry = data?.flavor_text_entries.find(
                    (entry) => entry.language.name === 'en'
                );
                return firstEntry ? firstEntry?.flavor_text.replace(/\f/g, " ").trim() : null;
            } else {
                return null; 
            }
        } catch (error) {
            toast.error(error+' Failed to fetch Pokémon details.');
        } 

    },[id])

    
    React.useEffect(() => {
        if(id && !flavorText && !isLoading) {
         setIsLoading(true);
         fetchText().then((text)=>{ if(text){setFlavorText(text as string);setIsLoading(false)}});

    }
    }, [fetchText, flavorText, id, isLoading]);
    console.log(isLoading);
    

    return(

        <>
         
                                
            {!isLoading ? (<> <Card className = "Info-Card" sx = {{ width: '50%', borderRadius: '8%', m: 'auto', boxShadow: 3,}}>
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
                                <Typography variant="body2" style = {{textWrap: 'wrap'}} sx ={{wordBreak: "break-word",color: 'text.secondary'}}>
                                    {flavorText}</Typography>
                        </CardContent>
                    </Box>

                </Card>
            <Button className='Routing-button' sx = {{m: 2, backgroundColor: 'black'}} variant="text"><Link style = {{height: 24}} to="/"><KeyboardBackspaceIcon style={{color: 'white'}}/></Link> </Button> </>) : (<Skeleton animation="wave" variant="rectangular" width={299.26} height={372.84} sx = {{ borderRadius: '8%', m: 'auto', boxShadow: 3}} />)}
           
        </>
    )
}


export default PokeInfo;