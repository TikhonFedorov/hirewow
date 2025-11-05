import type { Modifier } from '@popperjs/core';
import type { SelectPopupProps } from './types';
export declare const getModifiers: (args: Pick<SelectPopupProps, 'width' | 'disablePortal' | 'virtualized'>) => (Modifier<"sameWidth", {}> | Pick<Modifier<"preventOverflow", {}>, "name" | "options">)[];
