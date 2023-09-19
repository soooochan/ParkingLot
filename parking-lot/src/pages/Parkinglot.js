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
       
      {typeName : "임산부", percent: "40%"},
      {typeName : "장애인 주차구역", percent: "30%"},
      {typeName : "전기차 충전소", percent: "30%"},
    ];
    this.cartypeData =[
      {typeName : "승용차", percent: "40%"},
      {typeName : "상용차", percent: "30%"},
      {typeName : "전기차", percent: "30%"},
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