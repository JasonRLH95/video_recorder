import React from 'react';
import '../style/controlers.css';

export default function Controlers({ cameraOn, recording, videoURL, startCamera, stopCamera, startRecording, stopRecording, simulationFlag, setSimulationFlag }) {
  return (
    // manage the UI controlers to only appear at relevant condition
    <div className="video_controlers_container">
        
      
        {/* 
        only before done recording
        when camera is off => give an option to open camera ||
        when camera is on => give an option to close camera 
        */}
        {!cameraOn && !videoURL ? 
            <button onClick={startCamera} className='controlers_btn' id='cam_start'  disabled={recording}></button>
            : cameraOn && !videoURL && <button onClick={stopCamera} className='controlers_btn'  id='cam_stop'  disabled={recording}></button>
        }
        

        {/*
        only before done recording
        when recording => give an option to stop ||
        when not recording => give an option to start
        */}
        {!recording && !videoURL ?
            <button onClick={startRecording} className='controlers_btn' id='record_start'></button>
            : recording && !videoURL && <button onClick={stopRecording} className='controlers_btn' id='record_stop'></button>
        }


        {/*
        when camera is off, not recording, and already done recording a video =>
        give an option to upload the video, make sure the upload button vanish when uploading simulation is on
        */}
        {!recording && !cameraOn && videoURL && !simulationFlag && <button onClick={()=>{setSimulationFlag(true)}} disabled={!videoURL} className='controlers_btn_upload'>⬆ Upload Video ⬆</button>}
    </div>
  )
}
