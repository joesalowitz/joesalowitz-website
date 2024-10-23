import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const RiveAnimation: React.FC = () => {
    const { RiveComponent } = useRive({
        src: 'public/jsllc_logo.riv', // Path to your .riv file
        autoplay: true,
        stateMachines: 'State Machine 1', // Name of the state machine to play
    });

    return <RiveComponent />;
};

export default RiveAnimation;
