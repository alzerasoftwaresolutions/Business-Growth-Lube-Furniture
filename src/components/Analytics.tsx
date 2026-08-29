import { useEffect } from 'react';

/**
 * Initializes Google Analytics 4 tracking.
 * It will only activate if VITE_GA_MEASUREMENT_ID is set in the environment variables.
 */
export function Analytics() {
  useEffect(() => {
    const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    // Do nothing if the measurement ID is not provided
    if (!gaMeasurementId) {
      return;
    }

    // Check if script already exists to avoid duplicate injection during HMR or re-renders
    if (document.getElementById('ga-script')) {
      return;
    }

    // Inject GA gtag.js script
    const script1 = document.createElement('script');
    script1.id = 'ga-script';
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script1);

    // Inject GA initialization script
    const script2 = document.createElement('script');
    script2.id = 'ga-init-script';
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `;
    document.head.appendChild(script2);
  }, []);

  return null;
}
