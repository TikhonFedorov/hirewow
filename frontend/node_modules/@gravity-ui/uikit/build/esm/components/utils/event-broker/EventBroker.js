import { __rest } from "tslib";
import { NAMESPACE } from '../cn';
export class EventBroker {
    constructor(prefix) {
        this.subscriptions = [];
        this.componentPrefix = prefix;
    }
    subscribe(subscription) {
        this.subscriptions.push(subscription);
    }
    unsubscribe(subscription) {
        const index = this.subscriptions.indexOf(subscription);
        if (index > -1) {
            this.subscriptions.splice(index, 1);
        }
    }
    publish(_a) {
        var { componentId } = _a, restData = __rest(_a, ["componentId"]);
        this.subscriptions.forEach((fn) => fn(Object.assign(Object.assign({}, restData), { componentId: this.componentPrefix
                ? `${this.componentPrefix}${componentId}`
                : componentId })));
    }
    withEventPublisher(componentId, qa) {
        return (eventBrokerData) => {
            this.publish(Object.assign(Object.assign({}, eventBrokerData), { componentId,
                qa }));
        };
    }
}
export const eventBroker = new EventBroker(NAMESPACE);
