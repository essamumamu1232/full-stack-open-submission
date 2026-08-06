import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Full Stack Open - Part 14: Next.js Studio',
  description: 'Full Stack Open Part 14 submission - Next.js App Router, Server Components & Fullstack Architecture',
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
          {children}
        </div>
      </body>
    </html>
  );
}
