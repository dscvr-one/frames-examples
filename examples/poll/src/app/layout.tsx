import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>Poll sample</h1>
        {children}
      </body>
    </html>
  );
}
