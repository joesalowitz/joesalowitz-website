import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const RiveAnimation: React.FC = () => {
    const { RiveComponent, rive } = useRive({
        src: '/jsllc_logo.riv',
        autoplay: true,
        stateMachines: 'State Machine 1', // Name of the state machine to play
    });

    return <RiveComponent />;
};

export default RiveAnimation;
