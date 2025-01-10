import * as React from 'react';
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { PaginationItem } from '@mui/material';

type ChangePageProps = {
    maxValue: number | undefined;
    setCounter: React.Dispatch<React.SetStateAction<number>>;
}

export default function PaginationOutlined({maxValue,setCounter}: ChangePageProps) {
    const [page, setPage] = React.useState<number>(1);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const newCounter = (value - 1) * 10;  
        setCounter(newCounter);
    };
     
      
    return(
        <Stack spacing={2} sx={{alignItems: 'center'}}>
            
            <Pagination count={Math.round((maxValue as number)/10)} page ={page} variant='outlined' shape='rounded' onChange={handleChange} renderItem={(item)=> (
                <PaginationItem  {...item}/>
                
            )}/>
        
        </Stack>
    );
}
