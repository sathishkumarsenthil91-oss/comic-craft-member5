import './globals.css';

export const metadata = {
  title: 'ComicCraft',
  description: 'AI Comic Story Creator using Gemini',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
