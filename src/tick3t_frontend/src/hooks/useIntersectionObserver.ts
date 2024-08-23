// src/hooks/useIntersectionObserver.ts
import { useEffect, useState } from 'react';

const useIntersectionObserver = (element: Element | null, threshold: number = 0.1) => {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

    useEffect(() => {
        if (!element) return;

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isIntersecting) {
                    setIsIntersecting(true);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, { threshold });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [element, threshold, isIntersecting]);

    return isIntersecting;
};

export default useIntersectionObserver;
