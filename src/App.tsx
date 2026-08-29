import React, { useCallback, useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { RFQModal } from './components/ui/RFQModal';
import { ProductDetailModal } from './components/ui/ProductDetailModal';
import { HomePage } from './pages/Home';
import { CollectionsPage } from './pages/CollectionsPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PageType, Product } from './types';
import { Analytics } from './components/Analytics';

const App: React.FC = () => {
  const [page, setPage] = useState<PageType>(() => {
    const path = window.location.pathname.substring(1);
    const validPages: PageType[] = ['home', 'collections', 'services', 'about', 'contact'];
    return validPages.includes(path as PageType) ? (path as PageType) : 'home';
  });
  const [collectionContext, setCollectionContext] = useState<string | undefined>(undefined);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqContext, setRfqContext] = useState<{ productName?: string; collectionName?: string }>({});
  const [viewedProduct, setViewedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      const validPages: PageType[] = ['home', 'collections', 'services', 'about', 'contact'];
      setPage(validPages.includes(path as PageType) ? (path as PageType) : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((next: PageType) => {
    setPage(next);
    window.history.pushState({}, '', next === 'home' ? '/' : `/${next}`);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const openRfq = useCallback((context?: { productName?: string; collectionName?: string }) => {
    setRfqContext(context ?? {});
    setRfqOpen(true);
  }, []);

  const exploreCollections = useCallback(() => {
    setCollectionContext(undefined);
    navigate('collections');
  }, [navigate]);

  const exploreCollection = useCallback(
    (collectionId: string) => {
      setCollectionContext(collectionId);
      navigate('collections');
    },
    [navigate]
  );


  return (
    <div className="flex min-h-screen flex-col bg-warm-ivory">
      <Analytics />
      <Header currentPage={page} onNavigate={navigate} onRequestQuote={() => openRfq()} />

      <main className="flex-1">
        {page === 'home' && (
          <HomePage
            onExploreCollections={exploreCollections}
            onExploreCollection={exploreCollection}
            onExploreServices={() => navigate('services')}
            onRequestQuote={() => openRfq()}
            onContact={() => navigate('contact')}
            onViewProduct={(product) => setViewedProduct(product)}
          />
        )}
        {page === 'collections' && (
          <CollectionsPage
            key={collectionContext ?? 'all'}
            initialCollection={collectionContext}
            onRequestQuote={() => openRfq()}
            onViewProduct={(product) => setViewedProduct(product)}
          />
        )}
        {page === 'services' && (
          <ServicesPage onRequestQuote={() => openRfq()} onContact={() => navigate('contact')} />
        )}
        {page === 'about' && (
          <AboutPage onRequestQuote={() => openRfq()} onExploreCollections={exploreCollections} />
        )}
        {page === 'contact' && <ContactPage onRequestQuote={() => openRfq()} />}
      </main>

      <Footer onNavigate={navigate} onExploreCollection={exploreCollection} />

      <RFQModal isOpen={rfqOpen} onClose={() => setRfqOpen(false)} context={rfqContext} />
      <ProductDetailModal
        product={viewedProduct}
        onClose={() => setViewedProduct(null)}
        onRequestQuote={(product) => {
          const collectionName =
            product.collectionId.charAt(0).toUpperCase() + product.collectionId.slice(1);
          setViewedProduct(null);
          openRfq({ productName: product.name, collectionName });
        }}
      />
    </div>
  );
};

export default App;
