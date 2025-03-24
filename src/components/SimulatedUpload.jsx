import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../style/simulatedUpload.css';

export default function SimulatedUpload({ simulationFlag, setSimulationFlag, uploadVideo }) {

    //percentage of the uploading progress
    const [progress,setProgress] = useState(0);

    // smoothly scroll down when simulation starts for better user experience
    useLayoutEffect(()=>{
        window.scrollTo({
            top: 100,
            behavior: "smooth",
        });
    },[])
    // render the uploading simulation when click on upload button to handle the movement of the bar and the progress
    useEffect(()=>{
        if(simulationFlag){
            simulatedFill();
        }
    },[progress, simulationFlag])
    
    const simulatedFill =()=>{
        // when finish upload, make a delaying completion for simulation an API request and execute the upload method
        if(progress === 100){
            document.querySelector(".uploadFill").style.transform = `translate(${6*progress}px)`
            setTimeout(() => {
                setSimulationFlag(false);
                uploadVideo();
            }, 1000);
            return;
        }
        // set an interval to handle the progress and bar filling simulation
        var uploading = setInterval(() => {
            document.querySelector(".uploadFill").style.transform = `translate(${6*progress}px)`
            setProgress(progress+1);
            clearInterval(uploading);
        }, 40);
    }

    return (
        <div className='simulatedUpload_component'>
            {simulationFlag &&
                <>
                    <div className="uploadProgress">{progress}%</div>
                    <div className="uploadDiv">
                        <div className="uploadBar">
                            <h2>Uploading Your Video...</h2>
                        </div>
                        <div className="uploadFill"></div>
                    </div>
                </>
            }
        </div>
    )
}
