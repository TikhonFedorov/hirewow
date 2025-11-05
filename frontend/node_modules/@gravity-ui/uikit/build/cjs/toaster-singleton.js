"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toaster = void 0;
const ToasterSingleton_1 = require("./components/Toaster/ToasterSingleton");
// in SSR case
exports.toaster = typeof window === 'object' ? new ToasterSingleton_1.ToasterSingleton() : {};
