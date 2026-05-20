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

        <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900">
          <input
            type="file"
            accept=".pdf"
            className= "mb-4 block"
          />

          <button className="bg-white text-black px-4 py-2 rounded-xl font-medium">
            Upload PDF
          </button>
        </div>
      </div>
    </main>
  );
}