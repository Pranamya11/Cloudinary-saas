"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'


function VideoUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    const MAX_FILE_SIZE = 70 * 1024 * 1024

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds the maximum limit of 70MB.")
            return;
        }
        setIsUploading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("originalSize", file.size.toString());

        try {
            const response = await axios.post("/api/video-upload", formData)
            console.log("Upload response:", response.data)
            
            if (response.status === 200) {
                router.push(`/videos/${response.data.id}`)
            } else {
                alert("Upload failed. Please try again.")
            }

        } catch (error) {
            console.error("Error uploading video:", error)
        } finally {
            setIsUploading(false)
        }

    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }



    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="border rounded-lg p-4">
                    <label className="block font-medium mb-2">Video File *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4">
                        {file ? (
                            <div className="text-center">
                                <div className="mb-2">✅ {file.name}</div>
                                <div className="text-sm text-gray-500">
                                    Size: {formatFileSize(file.size)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-500 mb-3">Select a video file to upload</p>
                                <label className="inline-block cursor-pointer">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Choose File
                                    </div>
                                </label>
                                <p className="text-xs text-gray-400 mt-2">
                                    Maximum file size: 70MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title Input */}
                <div className="border rounded-lg p-4">
                    <label className="block font-medium mb-2">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter video title"
                        required
                    />
                </div>

                {/* Description Input */}
                <div className="border rounded-lg p-4">
                    <label className="block font-medium mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        placeholder="Enter video description"
                    />
                </div>

                {/* Submit Button */}
                <div className="border rounded-lg p-4">
                    <button
                        type="submit"
                        disabled={isUploading || !file || !title}
                        className={`w-full py-3 rounded text-white font-medium ${isUploading || !file || !title
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isUploading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </div>
                        ) : (
                            'Upload Video'
                        )}
                    </button>

                    <div className="text-sm text-gray-500 mt-3">
                        <p>Fields marked with * are required</p>
                        {file && file.size > MAX_FILE_SIZE && (
                            <p className="text-red-500 mt-1">
                                File size exceeds the 70MB limit
                            </p>
                        )}
                    </div>
                </div>
            </form>

            {/* Preview Section */}
            {file && (
                <div className="mt-8 border rounded-lg p-4">
                    <h2 className="font-medium mb-3">Preview</h2>
                    <div className="border rounded p-3">
                        <p><strong>File:</strong> {file.name}</p>
                        <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                        <p><strong>Type:</strong> {file.type}</p>
                        <p><strong>Title:</strong> {title || 'Not set'}</p>
                        <p><strong>Description:</strong> {description || 'Not set'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VideoUpload