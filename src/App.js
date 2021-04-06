import { CircularProgress } from '@material-ui/core'
import React, { useEffect, useState} from 'react'

import {Coin} from './Coin'


function App() {
  //They are initialized to today as the date is not important here 
  const [inputTime, setInputTime] = useState(new Date())
  const [outputTime, setOutputTime] = useState(new Date())
  const [payment, setPayment] = useState(0)
  const [price, setPrice] = useState(0)
  const [coinsgiven, setcoinsgiven] = useState([])
  const coins = [1,2,5,10,20,50,100,500,1000,2000]
  useEffect(() => {
    parseInputDate("00:00")
    parseOutputDate("00:00")
    // const paymentInput = document.getElementById("1p").value
    // setPayment(paymentInput)
    
  },[])

  useEffect( () => {
    calculatePrice()
  }, [inputTime, outputTime])

  useEffect( () => {
    calculateChange(payment,price)

  },[payment, price])
  /**
   * Converts user input time into a valid date
   * Sets state of inputTime
   * @param {string} time 
   */
  function parseInputDate(time) {
    var toDate = new Date()
    var colon = time.indexOf(":")
    var hrs = time.slice(0,colon)
    var mins = time.slice(colon+1,)
    toDate.setHours(hrs)
    toDate.setMinutes(mins)
    setInputTime(toDate)
    
  }

  /**
   * Converts user output time into a valid date
   * Sets state of outputTime
   * @param {string} time 
   */
  function parseOutputDate(time) {
    var toDate = new Date()
    var colon = time.indexOf(":")
    var hrs = time.slice(0,colon)
    var mins = time.slice(colon+1,)
    toDate.setHours(hrs)
    toDate.setMinutes(mins)
    setOutputTime(toDate)
  }

  /**
   * Calculates the parking duration
   * @returns array that contains both the difference in hours and difference in minutes
   */
  function calculateDuration(){

    //Calculate difference in hours
    var subtractHrs = outputTime.getHours() - inputTime.getHours()
    //If the output time is less than input it assumes that this is for next day
    var diffInHrs = subtractHrs < 0 ? subtractHrs+24: subtractHrs
    
    //Calculate difference in minutes
    var subtractMins = outputTime.getMinutes() - inputTime.getMinutes()
    var diffInMins = subtractMins;

    // //Exceptional case Input Time == Output Time (assumes 24 hr)
    // if (diffInHrs == 0 && diffInMins == 0) {
    //   diffInHrs=24
    // }

    /**
     * If output time has less minutes than input time, then the hours decremented by one
     * and 60 is added to the current of minutes
     * E.g. 23:50 - 22:40 will have a difference of 22hr 50mins 
     */
    if (subtractMins < 0 ){
      diffInHrs--
      diffInMins+=60
    }
    else{
      diffInMins = subtractMins
    }

    return [diffInHrs, diffInMins]
  }

  /**
   * Calculates the parking fare
   * @returns price of the fare
   */
  function calculatePrice(){

    /** Calculate Duration **/
    var diffInHrs = calculateDuration()[0]
    var diffInMins = calculateDuration()[1]
    
    /** Calculate Price **/
    
    //First hour is £3
    var totalPrice = 3 
    
    //Have to calculate the amount of extra hours and convert them to minutes
    var hrsToMins = 0;

    //Does not include the first hour (£3) in the calculation
    if (diffInHrs > 1){
      diffInHrs--;
      hrsToMins = diffInHrs * 60
      
    }
    if (diffInHrs == 0){
      diffInMins = 0
    }
    //Total price is the initial hour + all the extra minutes * 1p
    totalPrice+=(hrsToMins+diffInMins)*0.01

    //Displays output in 2 decimal places

    setPrice(totalPrice)
  }

  /**
   * Calculates the coins to give back to user.
   * Uses greedy algorithm. 
   * @param {float} payment 
   * @param {float} price 
   * @returns Array of coins to be given back to customer
   */
  function calculateChange(payment, price) {
  //If the payment is 0 return 0, (a bug would make this return 0.01 when input was blank)
  if (payment == 0){
    return [0]
  }

  var current = 0
  payment*=100
  price*=100  
  var change = payment - price


  var coinsToGive = []
  for (let i = coins.length-1; i>=0; i--){
    if (change - coins[i] >= 0){
    change-=coins[i]
    current = i
    break
    }
  }
  coinsToGive.push(coins[current])

  while (change > 0){
    if (change - coins[current] >= 0){
      change-=coins[current]
      coinsToGive.push(coins[current])
    }
    if (change -  coins[current - 1] >= 0){
      change-=coins[current - 1]
      current = current - 1
      coinsToGive.push(coins[current])
    }
    else {
      current-=1
    }
  }
  var coinsTocurrency = coinsToGive.map(coin => coin/100)
  setcoinsgiven(coinsTocurrency)

  }
  return (
    <div>
      <h1>Time In</h1>
      <input id="inputTime" type="time" />  
      
      <h1>Time Out</h1>
      <input id="outputTime" type="time" />

      <br />
      <br />

      <button type="submit" onClick={
        () => 
        {
          var inputTime = document.getElementById("inputTime").value
          var outputTime = document.getElementById("outputTime").value
          var validInput = parseInputDate(inputTime)
          parseOutputDate(outputTime)
          
          
        }
      }>Calculate Price</button>

      <h1>Receipt</h1>
      <h2>Price <strong>£{price.toFixed(2)}</strong></h2>
      <h2>Payment</h2>

      {coins.map(coin => {
      var id = coin+"p"
      return (
      <div>
        <input type="checkbox" name="mycheckboxes" id={id} />
        <label for={id}>£{(coin / 100).toFixed(2)}</label>
      </div>)})}
      

      <button onClick={() => { 
        var checkboxes = Array.from(document.getElementsByName("mycheckboxes"))
        var labels = document.getElementsByTagName("label")
        var checkedBoxes = []
        checkboxes.map( (box, index) => {
          if (box.checked && box){
            checkedBoxes.push(parseFloat(labels[index].textContent.slice(1,)))
          }
        })
        
        
        var inputMoney = checkedBoxes.reduce((total, num) => total + num,0).toFixed(2)
        var inputMoney = parseFloat(inputMoney)
        if (inputMoney < price){
          alert("Not enough")
          setPayment(0)
        }
        else {
          setPayment(parseFloat(inputMoney))
          

        }
        
        
        }}>Pay</button>
      <br />
      <h2>Paid: £{payment.toFixed(2)}</h2>
      
      <h1>Change</h1>
      {coinsgiven.reduce( (total,num) => total+num, 0).toFixed(2)}
      <br />
      <h1>Coins Given:{coinsgiven.map(coin => <Coin coin={coin} />)}</h1>

    </div>
  );
}

export default App;
