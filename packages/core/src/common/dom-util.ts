import {forceCast} from '../misc/type-util';

export const SVG_NS = 'http://www.w3.org/2000/svg';

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

export function supportsTouch(doc: Document): boolean {
	return doc.ontouchstart !== undefined;
}

function getGlobalObject(): any {
	return new Function('return this')();
}

export function getWindowDocument(): Document {
	const globalObj: Window = forceCast(getGlobalObject());
	return globalObj.document;
}

export function getCanvasContext(
	canvasElement: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
	const win = canvasElement.ownerDocument.defaultView;
	if (!win) {
		return null;
	}

	// HTMLCanvasElement.prototype.getContext is not defined on testing environment
	const isBrowser = 'document' in win;
	return isBrowser ? canvasElement.getContext('2d') : null;
}

const ICON_ID_TO_INNER_HTML_MAP: {[key in string]: string} = {
	check: '<path d="M2 8l4 4l8 -8"/>',
	dropdown: '<path d="M5 7h6l-3 3 z"/>',
	p2dpad:
		'<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>',
};

type IconId = keyof typeof ICON_ID_TO_INNER_HTML_MAP;

export function createSvgIconElement(
	document: Document,
	iconId: IconId,
): Element {
	const elem = document.createElementNS(SVG_NS, 'svg');
	elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
	return elem;
}

export function insertElementAt(
	parentElement: Element,
	element: Element,
	index: number,
): void {
	parentElement.insertBefore(element, parentElement.children[index]);
}

export function removeElement(element: Element): void {
	if (element.parentElement) {
		element.parentElement.removeChild(element);
	}
}

export function removeChildElements(element: Element): void {
	while (element.children.length > 0) {
		element.removeChild(element.children[0]);
	}
}

export function removeChildNodes(element: Element): void {
	while (element.childNodes.length > 0) {
		element.removeChild(element.childNodes[0]);
	}
}

export function indexOfChildElement(element: Element): number {
	const parentElem = element.parentElement;
	if (!parentElem) {
		return -1;
	}

	const children: Element[] = Array.prototype.slice.call(parentElem.children);
	return children.indexOf(element);
}

export function findNextTarget(ev: FocusEvent): HTMLElement | null {
	if (ev.relatedTarget) {
		return forceCast(ev.relatedTarget);
	}
	// Workaround for Firefox
	if ('explicitOriginalTarget' in ev) {
		return (ev as any).explicitOriginalTarget;
	}
	// TODO: Workaround for Safari
	// Safari doesn't set next target for some elements
	// (e.g. button, input[type=checkbox], etc.)

	return null;
}
