import React, { useEffect, useState} from 'react'




function App() {
  //They are initialized to today as the date is not important here 
  const [inputTime, setInputTime] = useState(new Date())
  const [outputTime, setOutputTime] = useState(new Date())

  useEffect(() => {
    parseInputDate("00:00")
    parseOutputDate("00:01")
    const inputTimeHTML = document.getElementById("inputTime")
    const outputTimeHTML = document.getElementById("outputTime")
    const calculatePriceButton = document.getElementById("current-price")

  },[])

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

    //Exceptional case Input Time == Output Time (assumes 24 hr)
    if (diffInHrs == 0 && diffInMins == 0) {
      diffInHrs=24
    }

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
    return Number(totalPrice).toFixed(2)
  }

  /**
   * 
   * @param {float} payment 
   * @param {float} price 
   * @returns Array of coins to be given back to customer
   */
  function calculateChange(payment, price) {
    
    /* Initialize variables*/

    //Convert money into pennies (so I don't have to deal with floating points)
    payment*=100
    price*=100 
    const coins = [1,2,5,10,20,50,100,200,500,1000,2000]


    var currentCoinIndex = 0 //The current coin selected from the coin bag
    var change = payment - price //The change to be given

    /* Now have to give the right coins to represent change */

    var coinsToGive = [] //The coins to give back to the customer

    //Calculates first coin to give back
    //This is done outside while loop to prevent O(n**2) complexity
    //Searches from the biggest coin/note and stops the loop when it finds suitable coin
    //E.g. if change is 585 then the loop will stop when the current coin is 500.
    //Updates the change and adds that coin to be given at the end
    for (let i = coins.length-1; i>=0; i--){
      if (change - coins[i] >= 0){
        change-=coins[i]
        currentCoinIndex = i
        break
      }
    }
    coinsToGive.push(coins[currentCoinIndex])

    //This is for the remaining change



    //If the change comes out to 0 the loop will stop

    while (change > 0){

      //It will check whether the current coin can be subtracted to make 0
      //e.g. if change is 5 and the current coin is 5 then add 5 to the list
      if (change - coins[currentCoinIndex] == 0){
        change-=coins[currentCoinIndex]
        coinsToGive.push(coins[currentCoinIndex])
      }

      //If not, it will try the previous coin, and see if the result is positive
      //If it is positive then this coin is added to the coins to give back
      if (change -  coins[currentCoinIndex - 1] >= 0){
        change-=coins[currentCoinIndex - 1]
        currentCoinIndex = currentCoinIndex - 1
        coinsToGive.push(coins[currentCoinIndex])
      }

      //If the current coin, nor the previous coin subtract from change to get >0 or ==0
      //Then the current coin Index shifts one step left. 
      else {
        currentCoinIndex-=1
      }
    }



    //Money was represented in pennies, so must divide each coin by 100
    var penniesToPounds = coinsToGive.map(coin => coin/100)
    
    return penniesToPounds


  }
  console.log(calculateChange(5,3.11))
  return (
    <div>
      <h1>Time In</h1>
      <input id="inputTime" type="text" />  
      
      <h1>Time Out</h1>
      <input id="outputTime" type="text" />

      <br />
      <br />

      <button id="calculate-price" type="submit" onClick={
        () => 
        {

          parseInputDate(inputTime)
          parseOutputDate(outputTime)
          
        }
      }>Calculate Price</button>

      <h1>Payment</h1>
      <input type="number" id="payment"></input>

      <h1>Receipt</h1>
      
      <h2>Price <strong>£{calculatePrice()}</strong></h2>

      

    </div>
  );
}

export default App;
