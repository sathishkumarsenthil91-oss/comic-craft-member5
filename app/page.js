'use client';

import { useMemo, useState } from 'react';

const demoIdea = 'A college student discovers a hidden time machine in Salem and travels to the Chola period.';

export default function HomePage() {
  const [idea, setIdea] = useState(demoIdea);
  const [genre, setGenre] = useState('Historical Sci-Fi');
  const [style, setStyle] = useState('Cinematic Comic');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [comic, setComic] = useState(null);
  const [error, setError] = useState('');

  const canGenerate = useMemo(() => idea.trim().length > 10 && !loading, [idea, loading]);

  async function generateComic() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, genre, style, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setComic(data);
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <span className="eyebrow">AI COMIC STORY CREATOR</span>
          <h1>ComicCraft</h1>
          <p>Turn one story idea into characters, chapters, dialogue and comic panels with Gemini.</p>
        </div>
        <div className="badge">Gemini + Supabase ready</div>
      </section>

      <section className="grid">
        <div className="card composer">
          <h2>Create a comic</h2>
          <label>Story idea</label>
          <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={7} />

          <div className="fieldGrid">
            <div>
              <label>Genre</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option>Historical Sci-Fi</option>
                <option>Action</option>
                <option>Fantasy</option>
                <option>Romance</option>
                <option>Horror</option>
                <option>Comedy</option>
              </select>
            </div>
            <div>
              <label>Art style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option>Cinematic Comic</option>
                <option>Manga</option>
                <option>Webtoon</option>
                <option>Graphic Novel</option>
              </select>
            </div>
            <div>
              <label>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Malayalam</option>
              </select>
            </div>
          </div>

          <button disabled={!canGenerate} onClick={generateComic}>
            {loading ? 'Creating your comic…' : 'Generate Comic'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="card preview">
          {!comic ? (
            <div className="empty">
              <div className="spark">✦</div>
              <h2>Your comic appears here</h2>
              <p>Generate a story to see the title, cast, chapters and panel plan.</p>
            </div>
          ) : (
            <>
              <div className="titleRow">
                <div>
                  <span className="eyebrow">GENERATED COMIC</span>
                  <h2>{comic.title}</h2>
                  <p>{comic.logline}</p>
                </div>
                <span className="status">{comic.source === 'gemini' ? 'AI generated' : 'Demo fallback'}</span>
              </div>

              <h3>Characters</h3>
              <div className="chips">
                {comic.characters?.map((c) => (
                  <div className="chip" key={c.name}>
                    <strong>{c.name}</strong>
                    <span>{c.role}</span>
                  </div>
                ))}
              </div>

              <h3>Chapters</h3>
              <div className="chapters">
                {comic.chapters?.map((chapter, i) => (
                  <article key={i}>
                    <div className="chapterHead">
                      <span>Chapter {i + 1}</span>
                      <strong>{chapter.title}</strong>
                    </div>
                    <p>{chapter.summary}</p>
                    <div className="panels">
                      {chapter.panels?.map((panel, p) => (
                        <div className="panel" key={p}>
                          <span>Panel {p + 1}</span>
                          <p>{panel.scene}</p>
                          {panel.dialogue && <blockquote>“{panel.dialogue}”</blockquote>}
                          <small>{panel.camera}</small>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
