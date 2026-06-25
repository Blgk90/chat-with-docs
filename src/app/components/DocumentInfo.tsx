import type { UploadResponse } from "@/types/upload-reponse";

type DocumentInfoProps = {
  document: UploadResponse;
};

export default function DocumentInfo({ document }: DocumentInfoProps) {
  return (
    <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="text-xl font-semibold">Document uploaded</h2>

      <div className="mt-4 space-y-2 text-sm text-gray-300">
        <p>File: {document.fileName}</p>
        <p>Pages: {document.pages}</p>
      </div>
    </div>
  );
}