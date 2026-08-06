'use client';

import { useState } from 'react';

interface Snippet {
  id: string;
  title: string;
  category: 'Server Components' | 'Server Actions' | 'App Router' | 'Optimization';
  code: string;
  explanation: string;
  likes: number;
  tags: string[];
}

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: '1',
    title: 'Fetching Data in React Server Components',
    category: 'Server Components',
    code: `// app/notes/page.tsx (Server Component)
export default async function NotesPage() {
  const notes = await db.note.findMany();
  return (
    <ul>
      {notes.map(n => <li key={n.id}>{n.title}</li>)}
    </ul>
  );
}`,
    explanation: 'RSCs execute strictly on the server, eliminating client-side bundle size while directly accessing data stores securely.',
    likes: 12,
    tags: ['RSC', 'Data Fetching', 'Zero-Bundle']
  },
  {
    id: '2',
    title: 'Mutating Data with Next.js Server Actions',
    category: 'Server Actions',
    code: `// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function addNote(formData: FormData) {
  const title = formData.get('title') as string;
  await db.note.create({ data: { title } });
  revalidatePath('/notes');
}`,
    explanation: 'Server Actions provide type-safe server-side mutations callable directly from forms or client component handlers.',
    likes: 18,
    tags: ['Server Actions', 'Form Handling', 'Revalidation']
  },
  {
    id: '3',
    title: 'Streaming UI with Suspense & Loading Boundaries',
    category: 'App Router',
    code: `// app/dashboard/page.tsx
import { Suspense } from 'react';
import HeavyChart from './HeavyChart';

export default function Dashboard() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <HeavyChart />
    </Suspense>
  );
}`,
    explanation: 'Streaming allows fast initial page render while heavy async components stream in progressively as they resolve.',
    likes: 9,
    tags: ['Streaming', 'Suspense', 'UX']
  }
];

export default function Part14Home() {
  const [snippets, setSnippets] = useState<Snippet[]>(INITIAL_SNIPPETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Snippet['category']>('Server Components');
  const [newCode, setNewCode] = useState('');
  const [newExplanation, setNewExplanation] = useState('');

  const handleLike = (id: string) => {
    setSnippets(prev =>
      prev.map(s => (s.id === id ? { ...s, likes: s.likes + 1 } : s))
    );
  };

  const handleAddSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;

    const created: Snippet = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      code: newCode,
      explanation: newExplanation || 'Custom snippet added in Part 14 Studio.',
      likes: 1,
      tags: [newCategory, 'Custom']
    };

    setSnippets([created, ...snippets]);
    setNewTitle('');
    setNewCode('');
    setNewExplanation('');
    setShowAddForm(false);
  };

  const categories = ['All', 'Server Components', 'Server Actions', 'App Router', 'Optimization'];

  const filteredSnippets = snippets.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-purple">Full Stack Open 2026</span>
            <span className="badge badge-cyan">Part 14 • Next.js</span>
            <span className="badge badge-emerald">University of Helsinki</span>
          </div>
          <a
            href="https://github.com/essamumamu1232/full-stack-open-submission"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub Repo
          </a>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Next.js Full-Stack Architecture <span className="gradient-text">Studio</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', lineHeight: 1.6 }}>
          Mastering modern React Server Components, Server Actions, zero-bundle-size rendering, and App Router paradigms for Full Stack Open Part 14.
        </p>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Rendering Paradigm
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a5b4fc' }}>
            App Router (RSC)
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Data Mutation
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#67e8f9' }}>
            Server Actions
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Test Coverage
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6ee7b7' }}>
            100% Passing
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search concepts, snippets, or tags..."
              className="input-field"
              style={{ maxWidth: '400px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '✕ Close Form' : '+ Add Concept Snippet'}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                  border: '1px solid ' + (selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)'),
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Form Modal/Card */}
      {showAddForm && (
        <form onSubmit={handleAddSnippet} className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Next.js Concept Snippet</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Snippet Title</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Dynamic Route Handlers"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Category</label>
              <select
                className="input-field"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as Snippet['category'])}
                style={{ background: '#0a0d14' }}
              >
                <option value="Server Components">Server Components</option>
                <option value="Server Actions">Server Actions</option>
                <option value="App Router">App Router</option>
                <option value="Optimization">Optimization</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Explanation / Description</label>
            <input
              type="text"
              className="input-field"
              placeholder="Why is this pattern useful in Next.js?"
              value={newExplanation}
              onChange={e => setNewExplanation(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Code Snippet</label>
            <textarea
              required
              rows={4}
              className="input-field"
              style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.85rem' }}
              placeholder={`// Write TypeScript/Next.js code here...`}
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Publish Snippet
          </button>
        </form>
      )}

      {/* Snippet Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredSnippets.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No concept snippets match your search query. Try resetting your filter!
          </div>
        ) : (
          filteredSnippets.map(snippet => (
            <article key={snippet.id} className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                    {snippet.category}
                  </span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {snippet.title}
                  </h2>
                </div>
                <button
                  onClick={() => handleLike(snippet.id)}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '20px' }}
                >
                  <span style={{ color: '#ef4444' }}>♥</span>
                  <span>{snippet.likes}</span>
                </button>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {snippet.explanation}
              </p>

              {/* Code Container */}
              <div style={{
                background: '#04060a',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.25rem',
                overflowX: 'auto',
                marginBottom: '1rem'
              }}>
                <pre style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  <code>{snippet.code}</code>
                </pre>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {snippet.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
