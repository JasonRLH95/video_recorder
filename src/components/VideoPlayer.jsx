import React, { useEffect, useState } from 'react';
import '../style/videoPlayer.css';

export default function VideoPlayer({ videoURL, videoBlob }) {

    // isDownloading flag
    const [downloadFlag, setDownloadFlag] = useState(true);
    
    // handle a smooth simulation for the download link to make it look like it's now ready to download after a short time out
    useEffect(()=>{
        setTimeout(() => {
            setDownloadFlag(false);
        }, 4000);
    },[])

    return (
        <>
            <video id='video' src={videoURL} controls disablePictureInPicture={true} controlsList="nodownload noremoteplayback nofullscreen" />
            {videoBlob && (
                <a
                    href={URL.createObjectURL(videoBlob)}
                    download="recorded-video.webm"
                    className='download_link'
                >
                    {downloadFlag ? 
                        <span className='loading_icon'></span>
                        : <span className='loading_text'>⬇ Download Video ⬇</span>
                    }
                </a>
            )}
        </>
    )
}
