import React, {useState} from "react";
import "../styles/Parkinglot.css";

class Home extends React.Component {

  nameSection(name){
    return(
      <div className="mainname">
       {name}
      </div>
    )

  }

  render() {
    return(

      <div>
      
          <img src="img/parking_detection.png" alt="logo" />  
   
         
        <div>
            {this.nameSection("Parking Area Type Occupied Sattus")}
        </div>
      
      </div>

    );
  }
}


export default Home;