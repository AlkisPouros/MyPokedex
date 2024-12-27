
import './App.css'
import  PokemonList  from './components/PokemonList.tsx'
import PokeInfo from './components/PokeInfo.tsx'
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import Favourites from './components/Favourites.tsx';



function App() {


// For testing purposes
const fetchAPI = async () => {
  try {
      const response = await fetch("http://localhost:5000/api");
      const data = await response.json();
      console.log(data.fruits as JSON);
  }catch(error)
  {
    console.error("Something went wrong ", error);
  }
}
useEffect(() => {
  fetchAPI();
},[])
  return (
    <>
    
       <h1>MyPokedex</h1>
        <Routes>
          <Route path="/" element={<PokemonList/>}/>
          <Route path="/PokeInfo/:id" element={<PokeInfo/>}/>
          <Route path="/Favourites" element={<Favourites/>}/>
        </Routes>

    </>
  )
}

export default App
