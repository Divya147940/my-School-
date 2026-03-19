import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useSEO = (title, description) => {
  const location = useLocation();

  useEffect(() => {
    const defaultTitle = "Shri Jageshwar Memorial Educational Institute";
    const defaultDesc = "Empowering minds for over 13 years with quality education and modern facilities.";

    document.title = title ? `${title} | NSGI` : defaultTitle;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || defaultDesc);

  }, [title, description, location]);
};

export default useSEO;
