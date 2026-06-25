'use client';

import { ChatRequestBody } from '@/types/chat';
import { UploadResponse } from '@/types/upload-reponse';
import { useRef, useState } from 'react';
import DocumentInfo from './DocumentInfo';
import ChatPanel from './ChatPanel';

export default function UploadBox() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

	const [isUploading, setIsUploading] = useState<boolean>(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const preWrapStyleAttr = {
		whiteSpace: 'pre-wrap'
	};

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (file) {
			setSelectedFile(file);
		}
	}

	function handleButtonClick() {
		fileInputRef.current?.click();
	}

	async function handleUpload() {
		if (!selectedFile) return;

		setIsUploading(true);

		const formData = new FormData();
		formData.append('file', selectedFile);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (response) {
			const data: UploadResponse = await response.json();
			setUploadResult(data);
		}

		setIsUploading(false);
	}

	function handleDocumentRemove() {
		
		if (fileInputRef.current) fileInputRef.current.value = '';
		setSelectedFile(null);
		setUploadResult(null);
	}

	return (
		<div className="border border-gray-800 rounded-2xl p-8 bg-gray-900">
			<input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="mb-4 block hidden" />

			{!selectedFile && <p className="text-sm text-gray-400 mb-4 text-center">No file selected. Please choose a PDF to upload.</p>}
			{selectedFile && (
				<p className="text-sm text-gray-400 mb-4">
					Selected file: {selectedFile.name}
					<br />
					File type : {selectedFile.type}
					<br />
					File size : {(selectedFile.size / 1024 / 1024).toFixed(2)} Mb
					<br />
					<span className={uploadResult ? 'text-green-700' : 'text-yellow-700'}>File State : {uploadResult ? 'Ready' : 'Not Uploaded'}</span>
				</p>
			)}

			<div className={`flex ${selectedFile ? ' justify-end' : ' justify-center'} mb-4`}>
				<button
					className="bg-white text-black px-4 py-2 rounded-xl font-medium mr-4 flex cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isUploading || uploadResult?.success}
					onClick={handleButtonClick}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
						/>
					</svg>
					Choose PDF
				</button>

				{selectedFile && (
					<div className="flex">
						<button
							className="bg-sky-500 text-black px-4 py-2 mr-4 rounded-xl font-medium flex cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
							onClick={handleUpload}
							disabled={isUploading || uploadResult?.success}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 mr-2 ">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
								/>
							</svg>
							{isUploading ? 'Uploading...' : 'Upload PDF'}
						</button>
						<button
							className="bg-red-500 text-black px-4 py-2 rounded-xl font-medium mr-4 flex cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
							disabled={isUploading}
							onClick={handleDocumentRemove}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								className="size-6 mr-4">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
							Delete current document
						</button>
					</div>
				)}
			</div>

			{uploadResult?.success && (
				<>
					<DocumentInfo document={uploadResult} />
					<ChatPanel documentText={uploadResult.text} />
				</>
			)}
		</div>
	);
}
