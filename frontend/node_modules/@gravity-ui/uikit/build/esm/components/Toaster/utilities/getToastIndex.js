export function getToastIndex(toasts, name) {
    return toasts.findIndex((toast) => toast.name === name);
}
