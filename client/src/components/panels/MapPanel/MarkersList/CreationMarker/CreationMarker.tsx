import React, { FocusEventHandler, useState } from 'react';
import classNames from "classnames";

import "./CreationMarker.scss";

interface CreationMarkerProps {
    onCreate(name: string): void;
}

function CreationMarker({ onCreate }: CreationMarkerProps) {
    const [slimMode, setSlimMode] = useState(true);
    let body: JSX.Element = 
        slimMode ?
            <SlimMode onClick={() => setSlimMode(false)}/>
        :
            <CreationMode onCreate={onCreate} onCancel={() => setSlimMode(true)}/>
    return (
        <div className='create-marker'>
            {body}
        </div>
    );
}

interface CreationModeProps {
    onCreate(name: string): void;
    onCancel(): void;
}

function CreationMode({onCreate, onCancel}: CreationModeProps) {
    const [name, setName] = useState("");
    const handleBlur = (eventArg: React.FocusEvent<HTMLFormElement>) => {
        if (eventArg.currentTarget.contains(eventArg.relatedTarget)) {
            return;
        }
        onCancel();
    }
    const handleKeyPress = (eventArg: React.KeyboardEvent<HTMLInputElement>) => {
        if (eventArg.key === "Escape") {
            onCancel();
        }
    }
    const handleSubmit = (eventArg: React.FormEvent<HTMLFormElement>) => {
            eventArg.preventDefault();
            onCreate(name)
    }
    return (
        <form onSubmit={handleSubmit} onBlur={handleBlur}>
            <input
                type="text"
                className='input'
                placeholder='Markers name...'
                autoFocus={true}
                value={name}
                onChange={(eventArg) => setName(eventArg.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button className='button button--primary' type='submit'>Add</button>
        </form>
    );
}

function SlimMode({onClick}: {onClick(): void}) {
    return (
        <button className='button'
            onClick={() => onClick()}
        >
            Add new marker
        </button>
    );
}

export { CreationMarker };
