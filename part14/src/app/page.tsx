'use client';

import { useState } from 'react';

export default function Home() {
  const [likes, setLikes] = useState(0);

  return (
    <main>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          🚀 Full Stack Open - Part 14: Next.js
        </h1>
        <p style={{ color: '#9ca3af' }}>
          University of Helsinki - Modern Web Development with Next.js & Server Components
        </p>
      </header>

      <div className="card">
        <h2>Part 14 Next.js Starter</h2>
        <p style={{ margin: '1rem 0' }}>
          This application serves as the submission template and project foundation for Full Stack Open Part 14.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn" onClick={() => setLikes(likes + 1)}>
            Like Project ({likes})
          </button>
        </div>
      </div>
    </main>
  );
}
