import React from 'react';
import { Observer } from '../../helpers/observer';

type Payload = { x: number, y: number };

const EventHubContext = React.createContext<Observer<Payload> | undefined>(undefined);

interface EventHubProviderProps {
    children?: React.ReactNode;
}

/**
 * Провайдер для кастомного EventHub-а.
 * Используется для проброса событий из ветки компонентов leaflet-а в обычные react компоненты страницы
 */
function EventHubProvider(props: EventHubProviderProps) {
    const eventHub = new Observer<Payload>();
    return (
        <EventHubContext.Provider value={eventHub}>
            {props.children && props.children}
        </EventHubContext.Provider>
    );

}

function useEventHub() {
    const context = React.useContext(EventHubContext)
    if (context === undefined) {
        throw new Error('useEventHub must be used within a EventHubContext')
    }
    return context;
}

export { EventHubProvider, useEventHub };
