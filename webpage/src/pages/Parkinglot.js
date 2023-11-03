import React, {useState} from "react";
import Parkinginfo from "./Parkinginfo";
import "../styles/Parkinglot.css";





class Home extends React.Component {

  constructor(props){
    super(props);
    this.state={
      visible1:false,
      visible2:false

    }
    this.parkingData =[

      {typeName : "0", parkingarea: "general", percent: "40%"}, 
      {typeName : "1", parkingarea: "handicapped", percent: "40%"},
      {typeName : "2", parkingarea: "general", percent: "30%"},
      {typeName : "3", parkingarea: "handicapped", percent: "30%"},
      {typeName : "4", parkingarea: "pregnant woman", percent: "40%"},
      {typeName : "5", parkingarea: "general", percent: "30%"},
      {typeName : "6", parkingarea: "pregnant woman", percent: "30%"},
      {typeName : "7", parkingarea: "general", percent: "40%"},
      {typeName : "8", parkingarea: "general", percent: "30%"},
      {typeName : "9", parkingarea: "general", percent: "30%"},
      {typeName : "10", parkingarea: "general", percent: "40%"},
      {typeName : "11", parkingarea: "pregnant woman", percent: "30%"},
      {typeName : "12", parkingarea: "pregnant woman", percent: "30%"},
      {typeName : "13", parkingarea: "general", percent: "40%"},
      {typeName : "14", parkingarea: "general", percent: "30%"},
      {typeName : "15", parkingarea: "general", percent: "30%"},
      {typeName : "16", parkingarea: "general", percent: "40%"},
      {typeName : "17", parkingarea: "general", percent: "30%"},
      {typeName : "18", parkingarea: "general", percent: "30%"},
      {typeName : "19", parkingarea: "general", percent: "40%"},
      {typeName : "20", parkingarea: "general", percent: "30%"},
      {typeName : "21", parkingarea: "pregnant woman", percent: "30%"},
      {typeName : "22", parkingarea: "general", percent: "30%"},
      {typeName : "23", parkingarea: "general", percent: "30%"},
      {typeName : "24", parkingarea: "general", percent: "40%"},
      {typeName : "25", parkingarea: "general", percent: "30%"},
      {typeName : "26", parkingarea: "general", percent: "30%"},
      {typeName : "27", parkingarea: "general", percent: "40%"},
      {typeName : "28", parkingarea: "general", percent: "30%"},
    
    ];
    this.cartypeData =[
      {typeName : "승용차", parkingarea: "general", percent: "40%"},
      {typeName : "상용차", parkingarea: "general", percent: "30%"},
      {typeName : "전기차", parkingarea: "general", percent: "30%"},
    ]
  }
  

  

  render() {
    const { visible1 , visible2} = this.state; // 상태에서 visible 값을 가져옴
   
    
  
  
    return(

      <div>
      
          <img src="img/parking_detection.png" alt="logo" />  
   
        {/* 토글 버튼 */}  
        <div className="Select">
        
        <div className="button">  
          <button className="mainname" onClick = {() => {
            this.setState({ visible1: !visible1 }); // 상태 업데이트
          }}
          >
            {visible1 ? "Parking Area Type Occupied Sattus" : "Parking Area Type Occupied Sattus"}
          </button>

          

          {visible1 && <Parkinginfo data={ this.parkingData } />} {/* 조건부 렌더링 */}
          
        </div>
        
        {/* 토글 버튼2 */}
        <div className="button">  
          <button className="mainname" onClick = {() => {
            this.setState({ visible2: !visible2 }); // 상태 업데이트
          }}
          >
            {visible2 ? "Car Type Occupied Status" : "Car Type Occupied Status"}
          </button>

          

          {visible2 && <Parkinginfo data={ this.cartypeData } />} {/* 조건부 렌더링 */}
          
        </div>

        </div>
           
    
       
      
      </div>

      

    );
  }
}


export default Home;