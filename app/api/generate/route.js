import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

function fallbackComic({ idea, genre, style, language }) {
  return {
    source: 'fallback',
    title: 'KAALAM — The Chola Portal',
    logline: `${idea} A damaged time machine traps him in the past while a hidden enemy tries to alter history.`,
    genre,
    style,
    language,
    characters: [
      { name: 'Arjun', role: '20-year-old Salem college student and time traveller' },
      { name: 'Kayalvizhi', role: 'Chola-era archer and Arjun’s guide' },
      { name: 'Veeran', role: 'Young Chola warrior who suspects Arjun' },
      { name: 'Agathiyan', role: 'Mysterious scholar who understands the machine' },
      { name: 'Karikalan', role: 'Masked enemy trying to change history' }
    ],
    chapters: [
      {
        title: 'The Hidden Chamber',
        summary: 'Arjun follows a strange light near Salem and discovers an underground device covered in ancient Tamil symbols.',
        panels: [
          { scene: 'Arjun leaves college as evening clouds gather over Salem.', dialogue: 'I should have gone straight home…', camera: 'Wide establishing shot' },
          { scene: 'A faint blue glow leaks from a broken stone entrance.', dialogue: 'What is that light?', camera: 'Over-the-shoulder shot' },
          { scene: 'Inside, Arjun finds a circular machine with inscriptions and a glowing crystal.', dialogue: 'This cannot be modern technology.', camera: 'Low-angle reveal' },
          { scene: 'The crystal reacts to his touch and floods the chamber with light.', dialogue: 'Wait—!', camera: 'Extreme close-up to white flash' }
        ]
      },
      {
        title: '1014 CE',
        summary: 'Arjun wakes in the Chola period, confused and surrounded by soldiers who believe he may be a spy.',
        panels: [
          { scene: 'Arjun wakes on a dusty road beside fields and distant temple towers.', dialogue: 'Where am I?', camera: 'Ground-level medium shot' },
          { scene: 'Mounted Chola soldiers surround him with spears.', dialogue: 'State your name and kingdom!', camera: 'Circular dramatic composition' },
          { scene: 'Kayalvizhi watches silently from a nearby tree line.', dialogue: '', camera: 'Long-lens hidden observer shot' },
          { scene: 'Arjun notices the time device component is missing from his bag.', dialogue: 'No… the crystal is gone.', camera: 'Close-up on empty compartment' }
        ]
      },
      {
        title: 'The Name in Stone',
        summary: 'A temple inscription reveals that someone in the Chola era already knew Arjun would arrive from Salem.',
        panels: [
          { scene: 'Kayalvizhi leads Arjun through an ancient temple corridor by torchlight.', dialogue: 'There is something you must see.', camera: 'Tracking shot' },
          { scene: 'Agathiyan brushes dust from a carved stone inscription.', dialogue: 'This carving is older than both of us.', camera: 'Close-up on hands and stone' },
          { scene: 'The inscription contains Arjun’s name and a reference to Salem.', dialogue: 'How can my name be here?', camera: 'Extreme close-up' },
          { scene: 'A masked figure watches from the darkness holding the missing crystal.', dialogue: 'At last, he has returned.', camera: 'Silhouette cliffhanger' }
        ]
      }
    ]
  };
}

function cleanJson(text) {
  return text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

export async function POST(request) {
  try {
    const input = await request.json();
    if (!input?.idea || input.idea.trim().length < 10) {
      return NextResponse.json({ error: 'Please enter a longer story idea.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(fallbackComic(input));
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are ComicCraft, an AI comic director. Create a compact comic plan from the user's idea.

Idea: ${input.idea}
Genre: ${input.genre}
Visual style: ${input.style}
Language: ${input.language}

Return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "logline": "string",
  "characters": [{"name":"string","role":"string"}],
  "chapters": [
    {
      "title":"string",
      "summary":"string",
      "panels":[{"scene":"string","dialogue":"string","camera":"string"}]
    }
  ]
}

Rules: create exactly 3 chapters, exactly 4 panels per chapter, 4-6 recurring characters, cinematic but concise descriptions, preserve character continuity, and write generated story text/dialogue in ${input.language}.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(cleanJson(response.text || ''));
    return NextResponse.json({ ...parsed, source: 'gemini', genre: input.genre, style: input.style, language: input.language });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Comic generation failed. Check the Gemini configuration and try again.' }, { status: 500 });
  }
}
