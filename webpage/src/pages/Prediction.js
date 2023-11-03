import React, {useState} from "react";
import Parkinginfo from "./Parkinginfo";
import "../styles/Parkinglot.css";





class Home extends React.Component {

  constructor(props){
    super(props);
    this.state={
      visible1:false,
      visible2:false,
      visible3:false

    }
  
  }
  renderImage(img_path) {
    return <img src={img_path}alt="Description" />;
  }

  

  render() {
    const { visible1 , visible2, visible3} = this.state; // 상태에서 visible 값을 가져옴
   
    
  
  
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
            {visible1 ? "Day" : "Day"}
          </button>


          {visible1 && this.renderImage("/img/day.png")} {/* 조건부 렌더링 */}
          
        </div>
        
        {/* 토글 버튼2 */}
        <div className="button">  
          <button className="mainname" onClick = {() => {
            this.setState({ visible2: !visible2 }); // 상태 업데이트
          }}
          >
            {visible2 ? "Month" : "Month"}
          </button>

          

          {visible2 && this.renderImage("/img/month.png")} {/* 조건부 렌더링 */}
          
        </div>

        <div className="button">  
          <button className="mainname" onClick = {() => {
            this.setState({ visible3: !visible3 }); // 상태 업데이트
          }}
          >
            {visible3 ? "Year" : "Year"}
          </button>

          

          {visible3 && this.renderImage("/img/year.png") } {/* 조건부 렌더링 */}
          
        </div>


        </div>
           
    
       
      
      </div>

      

    );
  }
}


export default Home;