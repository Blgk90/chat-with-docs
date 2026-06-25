'use client';

import { ChatRequestBody } from '@/types/chat';
import { UploadResponse } from '@/types/upload-reponse';
import { useRef, useState } from 'react';

export default function UploadBox() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

	const [question, setQuestion] = useState('');

	const [answer, setAnswer] = useState('');

	const [isAsking, setIsAsking] = useState(false);

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

	async function handleAskQuestion() {
		if (!uploadResult?.success || !question.trim()) return;

		try {
			setIsAsking(true);
			setAnswer('');

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question,
					documentText: uploadResult.text
				})
			});

			const data = await response.json();

			if (data.success) {
				setAnswer(data.answer);
			} else {
				setAnswer(data.message);
			}
		} finally {
			setIsAsking(false);
		}
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
				<button className="bg-white text-black px-4 py-2 rounded-xl font-medium mr-4 flex" onClick={handleButtonClick}>
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
					<button className="bg-sky-500 text-black px-4 py-2 rounded-xl font-medium flex disabled:cursor-not-allowed disabled:opacity-50" onClick={handleUpload} disabled={isUploading || uploadResult?.success}>
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
				)}
			</div>

			{uploadResult?.success && (
				<div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
					<h2 className="mb-2 text-xl font-semibold">Ask something about this document</h2>

					<p className="mb-4 text-sm text-gray-400">The AI will answer using the extracted text from your PDF.</p>

					<textarea
						value={question}
						onChange={(event) => setQuestion(event.target.value)}
						placeholder="Example: What is this document about?"
						className="min-h-32 w-full resize-none rounded-xl border border-gray-700 bg-black p-4 text-white outline-none focus:border-gray-500"
					/>

					<button
						onClick={handleAskQuestion}
						disabled={isAsking || !question.trim()}
						className="mt-4 rounded-xl bg-white px-4 py-2 font-medium text-black disabled:cursor-not-allowed disabled:opacity-50">
						{isAsking ? 'Thinking...' : 'Ask'}
					</button>

					{answer && (
						<div className="mt-6 rounded-xl bg-black p-4">
							<h3 className="mb-2 font-semibold text-gray-300">Answer</h3>

							<p className="whitespace-pre-wrap text-gray-100">{answer}</p>
						</div>
					)}
				</div>
			)}

		</div>
	);
}
