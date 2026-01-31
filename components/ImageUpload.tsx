'use client';

import { useRef, ChangeEvent } from 'react';

interface ImageUploadProps {
    onImageUpload: (image: HTMLImageElement) => void;
    isProcessing: boolean;
}

export default function ImageUpload({ onImageUpload, isProcessing }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Create image element
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event) => {
            img.onload = () => {
                onImageUpload(img);
            };
            img.src = event.target?.result as string;
        };

        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Create a synthetic file input event
        const input = fileInputRef.current;
        if (input) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    return (
        <div
            className="glass-strong p-8 text-center cursor-pointer hover:bg-white/10 transition-all"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
            />

            <div className="flex flex-col items-center gap-4">
                <svg
                    className="w-16 h-16 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>

                <div>
                    <h3 className="text-xl font-semibold mb-2">
                        {isProcessing ? 'Processing...' : 'Upload Your Photo'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Drag and drop or click to select
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        JPG, PNG, or WEBP • Best with front-facing photos
                    </p>
                </div>
            </div>
        </div>
    );
}
