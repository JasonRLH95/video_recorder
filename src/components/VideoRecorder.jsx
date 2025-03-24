import React from 'react';
import "../style/videoRecorder.css";

export default function VideoRecorder() {
    // the preview video that displays the camera when recording, and before finish recording
    return (
        <video id='preview' autoPlay></video>
    )
}
