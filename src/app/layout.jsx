import '@fortawesome/fontawesome-free/css/all.css'; // import Font Awesome CSS
import { Inter } from 'next/font/google';
import Header from '../components/Header/Header.jsx';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
