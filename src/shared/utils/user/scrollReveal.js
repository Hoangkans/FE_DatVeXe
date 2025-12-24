import { useEffect, useRef } from 'react';

export function scrollReveal(threshold = 0.2) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            }
        });
        }, { threshold: threshold }); 

        const targets = container.querySelectorAll('.reveal-base');
        targets.forEach(target => observer.observe(target));

        return () => observer.disconnect(); 
    }, [threshold]);

  return containerRef;
}