export const Document = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>narrows</title>
      <link rel="preload" href="/src/client.tsx" as="script" />
    </head>
    <body>
      <div id="root">{children}</div>
      <script src="/src/client.tsx"></script>
    </body>
  </html>
);
