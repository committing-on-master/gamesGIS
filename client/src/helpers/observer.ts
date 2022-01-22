type Subscriber<T = any> = (...args: T[]) => void;
type Unsubscribe = () => void;

class Observer<T = any> {
    private subs: Subscriber[] = [];

    /**
     * Регистрация на событие
     * @param sub callback который будет вызван при событии
     * @returns callback для отписки от события
     */
    subscribe(sub: Subscriber<T>): Unsubscribe {
        this.subs.push(sub);
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
        this.subs.forEach((sub) => {
            sub(...args);
        });
    }
}

export { Observer };
