import React, { useState } from 'react'; // useState import
import "../styles/Parkinginfo.css"

const ParkingType = ({data}) => {
    // 다른 컴포넌트로 정보를 표시하거나 처리
    // 이 예에서는 일단 빈 컴포넌트
    return (
        <div className="type_content">
             <p>Parking Area: {data.parkingarea}</p>
            <p> Occupancy Percent: {data.percent}</p>
        </div>
    );
}


const Parkinginfo = ({data}) => {
    console.log("parking",data);
    const[visible,setVisible] = useState(false);

    const toggleVisibility = (index) => {
        setVisible(prevState => ({ ...prevState, [index]: !prevState[index] }));
    };


    

    return(
        <div class="parkinginfo">
            <div className="button">  
        
                {data.map((item,index)=>(
                    
                    <div class="type" key={index}>
                        <button className ="type_name" onClick = {() => {
                                toggleVisibility(index);
                        }}
                        >
                            {item.typeName} 구역
                        </button>
                        {visible[index] && <ParkingType data={item} />} {/* 조건부 렌더링 */}
                        
                    
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Parkinginfo;