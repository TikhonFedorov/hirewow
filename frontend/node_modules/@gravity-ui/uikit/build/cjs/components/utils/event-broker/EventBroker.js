"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBroker = exports.EventBroker = void 0;
const tslib_1 = require("tslib");
const cn_1 = require("../cn");
class EventBroker {
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
        var { componentId } = _a, restData = tslib_1.__rest(_a, ["componentId"]);
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
exports.EventBroker = EventBroker;
exports.eventBroker = new EventBroker(cn_1.NAMESPACE);
