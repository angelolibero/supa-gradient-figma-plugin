// useScrollPosition.js

import {RefObject, useEffect, useState} from 'react';

const useScrollPosition = (ref: RefObject<any>) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            if (ref.current) setScrollPosition(ref.current.scrollTop);
        };
        ref.current.addEventListener('scroll', updatePosition);
        updatePosition();
        return () => ref.current.removeEventListener('scroll', updatePosition);
    }, []);

    return scrollPosition;
};

export default useScrollPosition;
