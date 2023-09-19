import React from "react";
import "../styles/Parkinginfo.css"

const Parkinginfo = ({data}) => {
    console.log("parking",data);

    return(
        <div class="parkinginfo">
            {data.map((item,index)=>(
                <div class="type" key={index}>
                    <div class ="type_name">
                        {item.typeName}
                    </div>
                    <div class="percent">
                        {item.percent}
                    </div>
                
                </div>

            ))}
            
        </div>
    )
}

export default Parkinginfo;