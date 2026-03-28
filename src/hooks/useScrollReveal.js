import { useEffect } from 'react';

export const useScrollReveal = (options = {}) => {
    useEffect(() => {
        const observerOptions = {
            threshold: options.threshold || 0.15,
            rootMargin: options.rootMargin || '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal-on-scroll, .stagger-container');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin]);
    
    return null;
};

export default useScrollReveal;
