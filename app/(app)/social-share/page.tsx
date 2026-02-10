"use client"

import React, { useState } from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Landscape (1.91:1)": { width: 1080, height: 566, aspectRatio: "1.91:1" },
  "Twitter Post (16:9)": { width: 1024, height: 512, aspectRatio: "16:9" },
  "Facebook Post (1.91:1)": { width: 1200, height: 628, aspectRatio: "1.91:1" },
  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
};

type SocialFormatKey = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormatKey>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  const handleFormatChange = (format: SocialFormatKey) => {
    setSelectedFormat(format);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setIsTransforming(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadImage(data.publicId);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Set a timeout to auto-clear transforming state if image fails to load
      setTimeout(() => {
        setIsTransforming(false);
      }, 5000);
    }
  };

  const handleDownload = async () => {
    if (!uploadImage) return;

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const format = socialFormats[selectedFormat];
      
      // Direct Cloudinary URL for download
      const downloadUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${format.width},h_${format.height},g_auto/${uploadImage}`;
      
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `social-media-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert("Download failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Social Media Image Resizer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Upload Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
              {uploadImage ? (
                <p className="text-green-600 mb-4">✓ Image uploaded</p>
              ) : (
                <p className="text-gray-500 mb-4">Choose an image to upload</p>
              )}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className={`px-4 py-2 rounded ${isUploading ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'}`}>
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </div>
              </label>
            </div>
          </div>

          {/* Format Selection */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Select Format</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(socialFormats).map((format) => {
                const formatKey = format as SocialFormatKey;
                const isSelected = selectedFormat === formatKey;
                const formatData = socialFormats[formatKey];

                return (
                  <button
                    key={format}
                    onClick={() => handleFormatChange(formatKey)}
                    className={`p-3 text-left border rounded ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${!uploadImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!uploadImage}
                  >
                    <div className="font-medium text-sm">{format.split(' (')[0]}</div>
                    <div className="text-xs text-gray-500">{formatData.aspectRatio}</div>
                    <div className="text-xs text-gray-400">{formatData.width}×{formatData.height}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download Button */}
          <div className="border rounded-lg p-4">
            <button
              onClick={handleDownload}
              disabled={!uploadImage || isTransforming}
              className={`w-full py-3 rounded ${uploadImage && !isTransforming ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              {isTransforming ? 'Transforming...' : 'Download Image'}
            </button>

            {uploadImage && (
              <div className="mt-4 text-sm text-gray-600">
                <div>Current: {selectedFormat}</div>
                <div>{socialFormats[selectedFormat].width} × {socialFormats[selectedFormat].height}px</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Preview</h2>

          <div className="border rounded bg-gray-50 p-4 min-h-[400px] flex items-center justify-center">
            {uploadImage ? (
              <div className="text-center w-full">
                {isTransforming ? (
                  <div className="py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading image...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 max-w-full overflow-hidden">
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadImage}
                        alt="Transformed image"
                        className="max-w-full h-auto border rounded"
                        crop="fill"
                        gravity="auto"
                        onLoad={() => {
                          console.log("✅ Image loaded");
                          setIsTransforming(false);
                        }}
                        onError={(e) => {
                          console.error("❌ Image load error:", e);
                          setIsTransforming(false);
                          alert("Failed to load image. Please try again.");
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Preview for {selectedFormat.split(' (')[0]}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Upload an image to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}