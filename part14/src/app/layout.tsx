import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Full Stack Open - Part 14',
  description: 'Full Stack Open Part 14 Next.js notes application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav className="navbar">
            <h2>Full Stack Open - Part 14</h2>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
