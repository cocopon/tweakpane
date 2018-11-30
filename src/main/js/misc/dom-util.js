// @flow

import FlowUtil from './flow-util';

type Window = {
	document: Document,
};

export function forceReflow(element: HTMLElement): void {
	element.offsetHeight;
}

export function disableTransitionTemporarily(
	element: HTMLElement,
	callback: () => void,
): void {
	const t = element.style.transition;
	element.style.transition = 'none';

	callback();

	element.style.transition = t;
}

export function supportsTouch(document: Document): boolean {
	return (document: any).ontouchstart !== undefined;
}

export function getWindowDocument(): Document {
	const globalObj: Window = FlowUtil.forceCast(new Function('return this')());
	return globalObj.document;
}
