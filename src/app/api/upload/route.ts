import pdf from "pdf-parse/lib/pdf-parse.js";
import { UploadResponse } from '@/types/upload-reponse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsedPdf = await pdf(buffer);

    const responseBody : UploadResponse = {
      success: true,
      fileName: file.name,
      pages: parsedPdf.numpages,
      text: parsedPdf.text,
    }

    return Response.json(responseBody);
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Upload failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}