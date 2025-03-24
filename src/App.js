
import './App.css';
import Controlers from './components/Controlers';
import SimulatedUpload from './components/SimulatedUpload';
import VideoPlayer from './components/VideoPlayer';
import VideoRecorder from './components/VideoRecorder';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [simulationFlag,setSimulationFlag] = useState(false);
  const [initiateFlag,setInitiateFlag] = useState(false);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // revoking the video if exists to prevent memory leaks if the component didn't mounted,and make sure to display the initiate header whenever the video url is null terminates (on App component render || after video uploading)
  useEffect(()=>{
    if(!videoURL){
      setInitiateFlag(false);
    }
    return () => {
      if(videoURL) URL.revokeObjectURL(videoURL);
    }
  },[videoURL])

  // if already recorded a video, tell the user to decide first what to do with the video before start the camera, else => vanish the initiate header, ask for a permission from user to use his camera and audio (if didn't asked before) point that videoRef on the stream gets from camera and audio, and set this stream to be the source of the preview video in order to display that stream on the screen
  const startCamera = async() => {
    if(videoURL){
      return alert("Please decide first what to do with your video?..");
    }
    try{
        setInitiateFlag(true);
        const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
        videoRef.current = stream;
        document.getElementById("preview").srcObject = stream;
        setCameraOn(true);
    }
    catch(err){
        console.error("Error accessing camera:",err);
    }
  }

  // if camera recording then call the stop record method, and turn off camera
  const stopCamera = () => {
      if(recording){
          stopRecording();
      }
      if(videoRef.current){
          videoRef.current.getTracks().forEach(track => track.stop());
          videoRef.current = null;
          setCameraOn(false);
      }
  }
  
  // start recording, make sure the camera is already on, empty the record chunks array to prevent unnecessary chunks, start the recording with the mediaRecorder API, when any data available from recording => push to chunks array, when stop recording => check if supported on webm video type to prevent mistakes, if ok => create a blob from that chunks, and a url for that blob and saves them on the memory hooks
  const startRecording = () => {
      if(!cameraOn){
          return alert("Must turn camera on in order to record video");
      }
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(videoRef.current);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);

      mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        if (!MediaRecorder.isTypeSupported("video/webm")) {
          alert("Your browser does not support MP4 or WebM recording.");
          return;
        }
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };
  };


  // stop the video stream record, turn off the camera, null terminate the preview video source, set a timeout to the download and upload buttons for the movement effects
  const stopRecording = () => {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setCameraOn(false);
      if(videoRef.current){
          videoRef.current.getTracks().forEach(track => track.stop());
          videoRef.current = null;
      }
      document.getElementById("preview").srcObject = null;
      setTimeout(() => {
        document.querySelector(".download_link").style.top = "0";
        setTimeout(() => {
          document.querySelector(".controlers_btn_upload").style.opacity = "100%";
        }, 4500);
      }, 1500);
  };

  // uplaod the video, null terminate the video url, and redeclare the simulation flag to be false in case of multiple uploads one after one, give the user a message that video been uploaded
  const uploadVideo = () => {
    if (videoURL) {
      setVideoURL(null);
      setSimulationFlag(false);
      return alert("video uploaded successfully!");
    }
  };

  return (
    <div className="App">
      <h1 className='mainHeader'>My Video Recorder</h1>
      <div className="video_container">

        {/* before start the camera */}
        {!initiateFlag && (
          <div className='preview_initialHeaders'>
            <h1 className='preview_initialHeader_1'>Welcome</h1>
            <h2 className='preview_initialHeader_2'>Open camera to start recording</h2>
            <h4 className='preview_initialHeader_4'>Might need to allow permissions</h4>
          </div>
        )}

        {/* when start the camera and still recording */}
        {!videoURL && <VideoRecorder/>}

        {/* when stop recording and now manage download/upload etc. */}
        {videoURL && 
          <VideoPlayer
            videoURL={videoURL}
            videoBlob={videoBlob}
            videoRef={videoRef}
            uploadVideo={uploadVideo}/>}
      </div>
      
      {/* handle the relevant controlers displayed according to situation */}
      {!simulationFlag && <Controlers 
        cameraOn={cameraOn}
        recording={recording}
        videoURL={videoURL}
        startCamera={startCamera}
        stopCamera={stopCamera}
        startRecording={startRecording}
        stopRecording={stopRecording}
        simulationFlag={simulationFlag}
        setSimulationFlag={setSimulationFlag}/>}
      
      {/* when uploading, handle an upload simulation */}
      {simulationFlag && 
        <SimulatedUpload
          simulationFlag={simulationFlag}
          setSimulationFlag={setSimulationFlag}
          uploadVideo={uploadVideo}/>}
    </div>
  );
}

export default App;
