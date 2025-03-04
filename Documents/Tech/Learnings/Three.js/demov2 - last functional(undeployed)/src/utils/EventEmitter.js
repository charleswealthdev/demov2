export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        
        if (index !== -1) {
            callbacks.splice(index, 1);
            if (callbacks.length === 0) {
                this.events.delete(event);
            }
        }
    }

    once(event, callback) {
        const onceCallback = (...args) => {
            this.off(event, onceCallback);
            callback.apply(this, args);
        };
        return this.on(event, onceCallback);
    }

    emit(event, ...args) {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event);
        callbacks.forEach(callback => {
            try {
                callback.apply(this, args);
            } catch (error) {
                console.error(`Error in event ${event} callback:`, error);
            }
        });
    }

    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    listenerCount(event) {
        if (!this.events.has(event)) return 0;
        return this.events.get(event).length;
    }

    listeners(event) {
        if (!this.events.has(event)) return [];
        return [...this.events.get(event)];
    }

    eventNames() {
        return Array.from(this.events.keys());
    }
} 