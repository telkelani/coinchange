import React, { useEffect, useState} from 'react'




function App() {
  //They are initialized to today as the date is not important here 
  const [inputTime, setInputTime] = useState(new Date())
  const [outputTime, setOutputTime] = useState(new Date())

  useEffect(() => {
    parseInputDate("00:00")
    parseOutputDate("00:01")

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


  return (
    <div>
      <h1>Time In</h1>
      <input id="inputTime" type="text" />  
      
      <h1>Time Out</h1>
      <input id="outputTime" type="text" />

      <br />
      <br />

      <button type="submit" onClick={
        () => 
        {
          var inputTime = document.getElementById("inputTime").value
          var outputTime = document.getElementById("outputTime").value
          parseInputDate(inputTime)
          parseOutputDate(outputTime)
          
        }
      }>Calculate Price</button>

      <h1>Receipt</h1>
      
      <h2>Price <strong>£{calculatePrice()}</strong></h2>


    </div>
  );
}

export default App;
