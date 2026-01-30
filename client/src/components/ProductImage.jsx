import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function ProductImage({
    src,
    alt,
    className = '',
    fallbackClassName = '',
    onClick
}) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    // Fallback placeholder
    if (hasError || !src) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${fallbackClassName || className}`}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
            >
                <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-gray-500" />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
            {/* Loading placeholder with blur */}
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}

            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={handleError}
                onLoad={handleLoad}
                loading="lazy"
            />
        </div>
    );
}
