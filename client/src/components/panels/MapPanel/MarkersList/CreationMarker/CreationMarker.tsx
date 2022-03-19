import React, { useState } from 'react';

import styles from './CreationMarker.module.scss';

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
        <div className={styles.container}>
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
        <form
            className={styles.form_create}
            onSubmit={handleSubmit}
            onBlur={handleBlur}
        >
            <input
                type="text"
                className={styles.input}
                placeholder='Markers name...'
                autoFocus={true}
                value={name}
                onChange={(eventArg) => setName(eventArg.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button 
                className={styles.button_primary}
                type='submit'
            >Add</button>
        </form>
    );
}

function SlimMode({onClick}: {onClick(): void}) {
    return (
        <button className={styles.button}
            onClick={() => onClick()}
        >
            Add new marker
        </button>
    );
}

export { CreationMarker };
