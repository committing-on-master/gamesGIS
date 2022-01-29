import React from 'react';
import { PublisherSubscriber } from '../../../helpers/publisherSubscriber';

type Events = {
    "onMapClick": { x: number, y: number },
    "onMarkerPanelClick": { markerId: number }
}

const EventHubContext = React.createContext<PublisherSubscriber<Events> | undefined>(undefined);

interface EventHubProviderProps {
    children?: React.ReactNode;
}

/**
 * Провайдер для кастомного EventHub-а.
 * Используется для проброса событий из ветки компонентов leaflet-а в обычные react компоненты страницы
 */
function EventHubProvider(props: EventHubProviderProps) {
    const eventHub = new PublisherSubscriber<Events>();
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
