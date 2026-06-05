export type ChatResponse =
  | {
      success: true;
      answer: string;
    }
  | {
      success: false;
      message: string;
    };

export type ChatRequestBody = {
        question: string;
        documentText: string;
      };