import React from 'react';

/**
 * 
 */
class Observer<T = any> {
    private subs: Subscriber[] = [];

    /**
     * Регистрация на событие
     * @param sub callback который будет вызван при событии
     * @returns callback для отписки от события
     */
    subscribe(sub: Subscriber<T>): Unsubscribe {
        this.subs.push(sub);
        console.log("subscribed");
        return () => {
            console.log("unsibscribed");
            this.subs = this.subs.filter((item) => item !== sub);
        };
    }

    /**
     * Вызов события с параметрами
     * @param args 
     */
    publish(...args: T[]): void {
        console.log("publishe event");
        this.subs.forEach((sub) => {
            sub(...args);
        });
    }
}
type Subscriber<T = any> = (...args: T[]) => void;
type Unsubscribe = () => void;


type Payload = { x: number, y: number };
type CallbackType = (event: Payload) => void;


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
