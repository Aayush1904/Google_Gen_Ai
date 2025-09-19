import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let textContent = "";

    // Parse PDF
    if (file.type === "application/pdf") {
      const pdfData = await pdf(buffer);
      textContent = pdfData.text;
    } else if (file.type === "text/plain") {
      textContent = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Use AI to extract structured information
    const prompt = `
    Analyze this resume/CV text and extract the following information in JSON format:
    
    {
      "personalInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string"
      },
      "summary": "string",
      "skills": ["array of technical and soft skills"],
      "experience": [
        {
          "title": "string",
          "company": "string",
          "duration": "string",
          "description": "string",
          "achievements": ["array of achievements"]
        }
      ],
      "education": [
        {
          "degree": "string",
          "institution": "string",
          "year": "string",
          "gpa": "string (if mentioned)"
        }
      ],
      "certifications": [
        {
          "name": "string",
          "issuer": "string",
          "date": "string"
        }
      ],
      "projects": [
        {
          "name": "string",
          "description": "string",
          "technologies": ["array of technologies used"],
          "url": "string (if mentioned)"
        }
      ]
    }
    
    Resume text:
    ${textContent}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedData = JSON.parse(response.text());

    return NextResponse.json({
      success: true,
      extractedData,
      originalText: textContent,
    });
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
