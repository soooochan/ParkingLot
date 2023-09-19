import React, {useState} from "react";
import Myinfo from "./Myinfo";
import "../styles/Parkinglot.css";





class Home extends React.Component {

  constructor(props){
    super(props);
    this.state={
      visible:false
    }
  }
  

  

  render() {
    const { visible } = this.state; // 상태에서 visible 값을 가져옴
    
    

    return(

      <div>
      
          <img src="img/parking_detection.png" alt="logo" />  
   
        {/* 토글 버튼 */}  
        <div className="Select">
        
        <div className="button">  
          <button className="mainname" onClick = {() => {
            this.setState({ visible: !visible }); // 상태 업데이트
          }}
          >
            {visible ? "Parking Area Type Occupied Sattus" : "Parking Area Type Occupied Sattus"}
          </button>

          {visible && <Myinfo />} {/* 조건부 렌더링 */}

        </div>
        
        {/* 조건부 렌더링 */}

        </div>
           
        <div className="Select">
          <div className="button">  
            <button className="mainname" onClick = {() => {
              this.setState({ visible: !visible }); // 상태 업데이트
            }}
            >
              {visible ? "Parking Area Type Occupied Sattus" : "Parking Area Type Occupied Sattus"}
            </button>

            {visible && <Myinfo />} {/* 조건부 렌더링 */}

          </div>
        
        </div>
      
      </div>

      

    );
  }
}


export default Home;