import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>Quiz sample</h1>
        {children}
      </body>
    </html>
  );
}
