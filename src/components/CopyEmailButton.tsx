import React, { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import ButtonShimmer from '@/components/ui/button-shimmer';

export function CopyEmailButton() {
    const [_, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        copy('hi@joesalowitz.com');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <ButtonShimmer onClick={handleCopy}>
            <span className="w-full text-center inline-block">
                {isCopied ? (
                    "Email copied!"
                ) : (
                    <>
                        hi<span className="opacity-65">@</span>joesalowitz.com
                    </>
                )}
            </span>
        </ButtonShimmer>
    );
}
