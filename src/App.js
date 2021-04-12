import React, { useEffect, useState} from 'react'

import {CoinComponent} from './Coin'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button} from 'react-bootstrap';
import park from './park-background.jpg'
import './App.css'


function App() {
  //They are initialized to today as the date is not important here 
  const [inputTime, setInputTime] = useState(new Date())
  const [outputTime, setOutputTime] = useState(new Date())

  //State variables that get updated by user
  const [payment, setPayment] = useState(0)
  const [price, setPrice] = useState(0)
  const [coinsGiven, setcoinsGiven] = useState([])

  //Coins in pennies so calculation minimizes floating points
  //e.g.  £20 = 2000 pennies 
  //0 is at the beginning so when input is empty, 1p isn't given for no reason
  const coins = [0,1,2,5,10,20,50,100,500,1000,2000]

  //Whenever each of the times change, recalculate the price
  //Also reset the payment
  useEffect( () => {
    calculatePrice()
    resetQuantities()
  }, [inputTime, outputTime])

  //Whenever the price or payment changes, recalculate the change  
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
    var colon = time.indexOf(":") //Split string into hrs and mins separately 
    var hrs = time.slice(0,colon)
    var mins = time.slice(colon+1,)
    //Set the hours and minutes from input into a real datetime object
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
    var colon = time.indexOf(":") //Split string into hrs and mins separately 
    var hrs = time.slice(0,colon)
    var mins = time.slice(colon+1,)
    //Set the hours and minutes from input into a real datetime object
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
    var diffInMins = outputTime.getMinutes() - inputTime.getMinutes()

    /**
     * If output time has less minutes than input time, then the hours decremented by one
     * and 60 is added to the current of minutes
     * E.g. 23:50 - 22:40 will have a difference of 22hr 50mins 
     */
    
    if (diffInMins < 0 ){
      diffInHrs--
      diffInMins+=60
    }
    // else{
    //   diffInMins = subtractMins
    // }

    return [diffInHrs, diffInMins]
  }

  /**
   * Calculates the parking fare
   * Sets the price state variable to calculate price
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

    //If there is no hour difference
    //difference in minutes is also 0 so £3 is charged for the first hour
    
    //e.g. if someone stayed for 10mins they would still have to pay £3
    if (diffInHrs == 0){
      //If diffInMins were not 0 here it would charge 1p per min which is not correct
      diffInMins = 0
    }
    //Total price is the initial hour + all the extra minutes * 1p
    totalPrice+=(hrsToMins+diffInMins)*0.01
    //Sets price state
    setPrice(totalPrice)
  }

  /**
   * Calculates the coins to give back to user.
   * Uses greedy algorithm. 
   * @param {float} payment - How much user paid
   * @param {float} price  - The price of the fare
   * @returns Array of coins/notes to be given back to customer
   */
  function calculateChange(payment, price) {

  //currentCoinIndex: tracks the current coin selected out of the bag of coins
  //payment and price are converted to pennies
  //output change is calculated
  //coinsToGive is the array that will be returned 
  var currentCoinIndex = 0
  payment*=100
  price*=100  
  var change = payment - price
  var coinsToGive = []

  //Initial change calculation: finds the biggest possible coin that can be given
  //Stops the loop once its found
  //Calculates new change
  //parseInt because sometimes JS returns float when subtracting integers
  //Sets the current coin index to where it stopped the loop
  for (let i = coins.length-1; i>=0; i--){
    if (change - coins[i] >= 0){
    change-=coins[i]
    change = parseInt(change)
    currentCoinIndex = i
    break
    }
  }
  //Adds the coin to the coinsToGive bag
  coinsToGive.push(coins[currentCoinIndex])


  //Will search for suitable coins until change is 0
  while (change > 0){
    //If taking away the current coin from the remaining change is positive or 0
    //Put the current coin in the coinsToGive bag
    if (change - coins[currentCoinIndex] >= 0){
      change-=coins[currentCoinIndex]
      coinsToGive.push(coins[currentCoinIndex])
    }
    //If not, then check the coin to the left of the list.
    //If taking away this coin from the the remaining change is positive or 0
    //Add that coin to the coinsToGive bag
    else if (change -  coins[currentCoinIndex - 1] >= 0){
      change-=coins[currentCoinIndex - 1]
      currentCoinIndex = currentCoinIndex - 1
      coinsToGive.push(coins[currentCoinIndex])
    }

    //If the current coin nor the coin to the left of it is a suitable coin
    //move to the left of the array and try again
    else {
      currentCoinIndex-=1
    }
  }

  //Remember, all of this was calculated in pennies
  //Now must convert all coins to currency format
  var coinsToCurrency = coinsToGive.map(coin => coin/100)

  //Set the state so that it can be used throughout the program
  setcoinsGiven(coinsToCurrency)

  }

  //Resets all money input quantities to 0
  const resetQuantities = () => 
  {

    var inputs = Array.from(document.getElementsByName("quantities"))
    inputs.forEach((input) => {
      input.value = 0
      setPayment(0)
  })

}
  //Container CSS (bootstrap containers are easier to be overridden by internal CSS)
  const containerStyles = 
  {
    padding: 0,
    backgroundImage: `url(${park})`,
    height: '100vh',
  }

  return (
    <Container fluid style={containerStyles}>
      <Row >
        <Col className="text-center">
          <h1 className="welcome">Welcome to Car Park</h1>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <p className="description"><strong>£3</strong> for the first hour, <strong>1p</strong> per extra minute
          <br />
          Max <strong>24hr</strong> stay!!
          </p>
          
        </Col>
      </Row>
      <Row className="time">
        <Col className="text-center">
          <h1>Time Entered</h1>
         
          <input className="time-inputbox" id="inputTime" type="time" />  
        </Col>

        <Col className="text-center">
          <h1>Time Exited</h1>
          <input className="time-inputbox" id="outputTime" type="time" />
        </Col>

        <Col className="text-center">
          
          <Button type="submit" variant="primary" onClick={
          () => 
        {
          //Gets user input and parses dates
          var inputTime = document.getElementById("inputTime").value
          var outputTime = document.getElementById("outputTime").value
          parseInputDate(inputTime)
          parseOutputDate(outputTime)
        }}>Calculate Price</Button>
        <h2>Price <strong style={{color: 'red'}}>£{price.toFixed(2)}</strong></h2>
        </Col>
      </Row>

      <Row className="change">
        <Col className="text-center" md={5}>
          <h1>Payment</h1>
          {/* Instead of writing 10 number inputs, return them in a map */}
          {coins.slice(1,).map(coin => {
            var id = coin+"p" //ID is the coin + p as coins are in pennies
            return (
              <div className="coinSelect">
              <input className="coinQuantity" 
              type="number" min="0" defaultValue="0" name="quantities" id={id} />
              <label htmlFor={id}>£{(coin / 100).toFixed(2)}</label>
              </div>)})}
          
          <div className="action-buttons">
          
            <Button onClick={() => { 
              // Gets amount paid by multiplying quantities with labels
              var quantityInputs = Array.from(document.getElementsByName("quantities"))
              
              var quantityLabels = document.getElementsByTagName("label")
              var moneyPaid = []
              for (let i = 0; i < quantityInputs.length; i++){
                var coinDisplayed = quantityLabels[i].textContent.slice(1,)
                
                moneyPaid.push(quantityInputs[i].value*coinDisplayed)
              }
              //This adds the total of each coin selected
              var totalMoneyPaid = moneyPaid.reduce((total, num) => total + num,0).toFixed(2)
              var totalMoneyPaid = parseFloat(totalMoneyPaid)
              
              //If user did not put enough money, then they will be alerted
              if (totalMoneyPaid < price){
                alert("Not enough")
                
              }
              else {
                setPayment(parseFloat(totalMoneyPaid))

              }
            }}>Pay</Button>

            {/* Resets quantities */}
            <Button variant="danger" type="submit" onClick={() => resetQuantities()}>Reset</Button>
          </div>
          <div>
            <h2 className="paid-text">Paid: £{payment.toFixed(2)}</h2>
          </div>
          
        </Col>
        <Col className="text-center">
          <h1>Change</h1>
          <h2 className="change-text">
            {/* The change is just the sum of all the coins */}
            £{coinsGiven.reduce( (total,num) => total+num, 0).toFixed(2)}</h2>
        </Col>
        <Col className="text-center">
          <h1>Coins/Notes</h1>
          {/* Separate component for coins as this  */}
          <h2>{coinsGiven.map(coin => <CoinComponent coin={coin} />)}</h2>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
