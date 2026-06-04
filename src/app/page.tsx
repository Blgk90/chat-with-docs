import UploadBox from "./components/UploadBox";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          Chat With Docs
        </h1>

        <p className="text-gray-400 mb-10">
          Upload a PDF and chat with it using AI.
        </p>

        <UploadBox />
      </div>
    </main>
  );
}