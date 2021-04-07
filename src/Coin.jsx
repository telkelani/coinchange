import React from 'react'

//Functional component to display the coins 
export function CoinComponent({coin}){
    return (<p>£{coin.toFixed(2)}</p>)
}