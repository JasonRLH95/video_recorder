import React, { useEffect, useState } from 'react';
import '../style/videoPlayer.css';

export default function VideoPlayer({ videoURL, videoBlob }) {

    // isDownloading flag
    const [downloadFlag, setDownloadFlag] = useState(true);
    
    // handle a short simulation for the download link to display the delayed loading of the download link
    useEffect(()=>{
        const link = document.querySelector(".download_link");
        setTimeout(() => {
            link.setAttribute("href",URL.createObjectURL(videoBlob));
            link.setAttribute("download","recorded-video.webm");
            setDownloadFlag(false);
        }, 4000);
    },[])

    return (
        <>
            <video id='video' src={videoURL} controls disablePictureInPicture={true} controlsList="nodownload noremoteplayback nofullscreen" />
            {videoBlob && (
                <a className='download_link'>
                    {downloadFlag ? 
                        <span className='loading_icon'></span>
                        : <span className='loading_text'>⬇ Download Video ⬇</span>
                    }
                </a>
            )}
        </>
    )
}
