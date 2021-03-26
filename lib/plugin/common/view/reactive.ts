import {SingleValueEvents} from '../model/value-map';
import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';

function compose<A, B, C>(
	h1: (input: A) => B,
	h2: (input: B) => C,
): (input: A) => C {
	return (input) => h2(h1(input));
}

function extractValue<T>(ev: SingleValueEvents<T>['change']): T {
	return ev.value;
}

function applyClass(elem: HTMLElement, className: string, active: boolean) {
	if (active) {
		elem.classList.add(className);
	} else {
		elem.classList.remove(className);
	}
}

const className = ClassName('');

function updateModifier(
	elem: HTMLElement,
	modifier: string,
): (value: boolean) => void {
	return (value) => {
		applyClass(elem, className(undefined, modifier), value);
	};
}

function updateDisabled(
	elem: HTMLButtonElement | HTMLInputElement | HTMLSelectElement,
) {
	return (value: boolean) => {
		elem.disabled = value;
	};
}

export function bindViewProps(viewProps: ViewProps, elem: HTMLElement) {
	viewProps
		.valueEmitter('disabled')
		.on('change', compose(extractValue, updateModifier(elem, 'disabled')));
	updateModifier(elem, 'disabled')(viewProps.get('disabled'));

	viewProps
		.valueEmitter('hidden')
		.on('change', compose(extractValue, updateModifier(elem, 'hidden')));
	updateModifier(elem, 'hidden')(viewProps.get('hidden'));
}

export function bindDisabled(
	viewProps: ViewProps,
	elem: HTMLButtonElement | HTMLInputElement | HTMLSelectElement,
) {
	viewProps
		.valueEmitter('disabled')
		.on('change', compose(extractValue, updateDisabled(elem)));
	updateDisabled(elem)(viewProps.get('disabled'));
}
