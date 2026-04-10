/**
 * App.jsx — root layout shell
 *
 * CHANGES FROM vite-ssg VERSION:
 * • HelmetProvider from react-helmet-async now wraps the entire tree here.
 *   vite-react-ssg has no app.use() — the only way to provide a context to
 *   every render (SSG + client) is to place it inside the root component.
 *   During static generation vite-react-ssg calls renderToString on this
 *   component tree, so HelmetProvider correctly collects all <Helmet> calls
 *   and flushes them into <head>.
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const handleOrderSuccess = () => setCompleted({});
    window.addEventListener('orderSuccess', handleOrderSuccess);
    return () => window.removeEventListener('orderSuccess', handleOrderSuccess);
  }, []);

  return (
    <HelmetProvider>
      <Provider store={store}>
        <div className="flex flex-col min-h-screen">
          <Header />
          {/*
            <Outlet /> renders the matched route component.
            Each page component injects its own SEO via <Helmet> from
            react-helmet-async. HelmetProvider above collects all those calls
            and injects them into <head> during both SSG and client renders.
          */}
          <main className="flex-1">
            <Outlet context={{ setCompleted, completed }} />
          </main>
          <Footer />
        </div>
      </Provider>
    </HelmetProvider>
  );
}

export default App;