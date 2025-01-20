import * as React from 'react';
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { PaginationItem } from '@mui/material';

type ChangePageProps = {
    maxValue: number | undefined;
    setCounter: React.Dispatch<React.SetStateAction<number>>;
    FilteredPokemonArraymaxLength: number;
}

export default function PaginationOutlined({maxValue,setCounter,FilteredPokemonArraymaxLength}: ChangePageProps) {
    const [page, setPage] = React.useState<number>(1);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const maxItems = FilteredPokemonArraymaxLength > 0 ? FilteredPokemonArraymaxLength : maxValue || 0;
        const newCounter = Math.min((value - 1) * 12, maxItems - 12);
        setCounter(newCounter);
    };
     
    const isPaginationDisabled = FilteredPokemonArraymaxLength <= 12 && FilteredPokemonArraymaxLength > 0;


    return(
        <Stack spacing={2} sx={{alignItems: 'center', width: '100%', mt: 2}}>
            
            <Pagination count={Math.ceil((FilteredPokemonArraymaxLength > 0 ? FilteredPokemonArraymaxLength : maxValue || 0) / 12)} page ={page} variant='outlined' shape='rounded' onChange={handleChange} disabled={isPaginationDisabled} sx={{ '& .MuiPaginationItem-root': {
        backgroundColor: 'black', 
        color: 'white',
        fontSize: '0.9rem', 
        minWidth: '36px', 
        minHeight: '36px', 
        padding: '6px', 
        '@media (max-width: 500px)': { 
          fontSize: '0.75rem',
          minWidth: '30px',
          minHeight: '30px',
        },
        '@media (max-width:400px)': {
            fontSize: '0.65rem',
            maxwidth: '10px',
            maxHeight: '10px',
        },
      },
      '& .MuiPaginationItem-root:hover': {
        backgroundColor: 'gray', 
      },
      '& .Mui-selected': {
        backgroundColor: 'white', 
        color: 'black',
      },}} renderItem={(item)=> (
                <PaginationItem sx={{backgroundColor: 'black', color:'white'}} {...item} />
                
            )}/>
        
        </Stack>
    );
}
