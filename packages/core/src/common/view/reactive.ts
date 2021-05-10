import {bindValue} from '../model/reactive';
import {Value} from '../model/value';

function applyClass(elem: HTMLElement, className: string, active: boolean) {
	if (active) {
		elem.classList.add(className);
	} else {
		elem.classList.remove(className);
	}
}

export function valueToClassName(
	elem: HTMLElement,
	className: string,
): (value: boolean) => void {
	return (value) => {
		applyClass(elem, className, value);
	};
}

export function bindValueToTextContent(
	value: Value<string | undefined>,
	elem: HTMLElement,
) {
	bindValue(value, (text) => {
		elem.textContent = text ?? '';
	});
}
