
import './App.css'
import  PokemonList  from './PokemonList.tsx'
import PokeInfo from './PokeInfo.tsx'
import { Route, Routes } from 'react-router-dom';
import React from 'react';



function App() {
  


  return (
    <>
    
       <h1>MyPokedex</h1>
        <Routes>
          <Route path="/" element={<PokemonList/>}/>
          <Route path="/PokeInfo/:id" element={<PokeInfo/>}/>
        </Routes>

    </>
  )
}

export default App
