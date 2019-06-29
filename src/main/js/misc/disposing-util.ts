export function disposeElement(elem: Element | null): null {
	if (elem && elem.parentElement) {
		elem.parentElement.removeChild(elem);
	}
	return null;
}
