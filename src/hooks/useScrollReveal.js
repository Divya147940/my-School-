import { useEffect, useRef } from 'react';

/**
 * Custom hook to apply 'revealed' class to elements when they enter the viewport.
 * @param {Object} options - IntersectionObserver options
 */
const useScrollReveal = (options = { threshold: 0.15 }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, we can stop observing it
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const currentItems = sectionRef.current?.querySelectorAll('.reveal-on-scroll');
        if (currentItems) {
            currentItems.forEach((item) => observer.observe(item));
        }

        return () => {
            if (currentItems) {
                currentItems.forEach((item) => observer.unobserve(item));
            }
        };
    }, [options]);

    return sectionRef;
};

export default useScrollReveal;
