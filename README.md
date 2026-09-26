# ComicCraft — AI Comic Story Creator

ComicCraft turns a short story idea into a structured comic using Gemini.

## Current MVP

- Story idea input
- Genre, art-style and language selection
- Gemini-generated title, logline and characters
- 3 chapters with 4 panels each
- Scene, dialogue and camera direction per panel
- Built-in Salem → Chola-period fallback demo
- Supabase-ready client helper
- Vercel-ready Next.js project
- Responsive mobile/desktop UI

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Gemini API key to `.env.local`. If no Gemini key is configured, the app returns the built-in demo comic so the UI can still be tested.

## Vercel environment variables

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Next upgrades

Image generation, authentication, saved comics, character consistency, panel editing and PDF export.
