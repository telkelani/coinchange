import React, { useState} from 'react'




function App() {
  const [inputTime, setInputTime] = useState(new Date())
  const [outputTime, setOutputTime] = useState(new Date())


  function parseInputDate(time) {
    var toDate = new Date()
    var colon = time.indexOf(":")
    var hrs = time.slice(0,colon)
    var mins = time.slice(colon+1,)
    console.log("time", hrs)
    toDate.setHours(hrs)
    toDate.setMinutes(mins)
    
    setInputTime(toDate)
  }

  function parseOutputDate(time) {
    var toDate = new Date()
    var colon = time.indexOf(":")
    var hrs = time.slice(0,colon)
    var mins = time.slice(colon+1,)
    toDate.setHours(hrs)
    toDate.setMinutes(mins)
    
    setOutputTime(toDate)
  }

  
  function calculateDuration(){

    var subtract_hrs = outputTime.getHours() - inputTime.getHours()
    var diff_in_hrs = subtract_hrs < 0 ? subtract_hrs+24: subtract_hrs

    var diff_in_mins = outputTime.getMinutes() - inputTime.getMinutes()

    return "Hrs: "+diff_in_hrs+" Mins: "+diff_in_mins;
  }

  return (
    <div>
      <h1>Time In</h1>
      <input id="inputTime" type="text" >
      </input>
      
      <h1>Time Out</h1>
      <input id="outputTime" type="text" >

      </input>

      <br />
      <br />

      <button type="submit" onClick={
        () => 
        {
          var input_time = document.getElementById("inputTime").value
          var output_time = document.getElementById("outputTime").value
          parseInputDate(input_time)
          parseOutputDate(output_time)

          

        }
      }>Calculate Difference</button>

      <p>Time Diff <strong>{calculateDuration()}</strong></p>


    </div>
  );
}

export default App;
