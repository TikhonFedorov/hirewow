import type { ToastProps, ToasterArgs } from './types';
declare const TOASTER_KEY: unique symbol;
declare global {
    interface Window {
        [TOASTER_KEY]: ToasterSingleton;
    }
}
export declare class ToasterSingleton {
    static injectReactDOMClient(client: any): void;
    private rootNode;
    private reactRoot;
    private className;
    private mobile;
    private componentAPI;
    constructor(args?: ToasterArgs);
    destroy(): void;
    add: (options: ToastProps) => void;
    remove: (name: string) => void;
    removeAll: () => void;
    update: (name: string, overrideOptions: Partial<ToastProps>) => void;
    has: (name: string) => boolean;
    private createRootNode;
    private createReactRoot;
    private render;
    private setRootNodeClassName;
}
export {};
