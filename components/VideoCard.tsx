import React, { useCallback, useState, useEffect, use } from 'react'
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary"
import { Download, Clock, FileDown, FileUp, Play } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { filesize } from "filesize"
// import { Video } from '@prisma/client'
import { Video } from "@/types"


dayjs.extend(relativeTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
    onPlay: (url: string) => void;
}


const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onPlay }) => {

    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 200,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
            crop: "fill",
            gravity: "auto",
            format: "mp4",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getPreviewUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 200,
            rawTransformations: ["e_preview:duration_15:max_seg_dur_1"],
        })
    }, [])

    const formartSize = useCallback((size: number) => {
        return filesize(size, { base: 2, standard: "jedec" })
    }, [])

    const formatDuration = useCallback((duration: number) => {
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }, [])

    const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100);

    useEffect(() => {
        setPreviewError(false)

    }, [isHovered]);

    const handelPreviewError = () => {
        setPreviewError(true);

    }


    return (
        <div className='card bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        ><figure className='aspect-video relative'>
                {previewError ? (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                        <span className="text-white">Preview not available</span>
                    </div>
                ) : (
                    <img
                        src={getPreviewUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={handelPreviewError}
                    />
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    <h2 className='font-bold'>{video.title}</h2>
                    <p className='text-xs text-gray-300'>{formartSize(Number(video.originalSize))} → {formartSize(Number(video.compressedSize))} ({compressionPercentage}% reduction)</p>
                    <p className='text-xs text-gray-300'>Uploaded {dayjs(video.createdAt).fromNow()}</p>
                    <div className='flex items-center space-x-2 mt-1'>
                        <button onClick={() => onPlay(getFullVideoUrl(video.publicId))} className='flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300'>
                            <Play size={16} />
                            <span>Play</span>
                        </button>
                        <button onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)} className='flex items-center space-x-1 text-sm text-green-400 hover:text-green-600 transition-colors duration-300'>
                            <Download size={16} />
                            <span>Download</span>
                        </button>
                    </div>
                    {formatDuration(video.duration)}
                </div>
            </figure>
        </div>
    )
}

export default VideoCard