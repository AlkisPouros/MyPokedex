import React from 'react'
import { Link, useLocation } from 'react-router-dom';



const PokeInfo = ()=> {

    const location = useLocation();
    const { id, name, sprite } = location.state || {};

    return(

        <>
            <h1>Hello there!</h1>
            <h2>{name}</h2>
            <img src={sprite}></img>
            <h2>Pokemon ID: {id}</h2>
            <button type="button"><Link to="/">Back</Link> </button>
        </>
    )
}


export default PokeInfo;