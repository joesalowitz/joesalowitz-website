import { useState, useEffect } from 'react';

export function getContrastColor(hexColor: string): string {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Keep the hook for React components if needed
export function useContrastingColor(backgroundColor: string): string {
    const [contrastColor, setContrastColor] = useState('#ffffff');

    useEffect(() => {
        setContrastColor(getContrastColor(backgroundColor));
    }, [backgroundColor]);

    return contrastColor;
}
