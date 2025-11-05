"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toaster = void 0;
const tslib_1 = require("tslib");
const client_1 = tslib_1.__importDefault(require("react-dom/client"));
const ToasterSingleton_1 = require("./components/Toaster/ToasterSingleton");
ToasterSingleton_1.ToasterSingleton.injectReactDOMClient(client_1.default);
// in SSR case
exports.toaster = typeof window === 'object' ? new ToasterSingleton_1.ToasterSingleton() : {};
