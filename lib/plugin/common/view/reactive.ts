import {SingleValueEvents} from '../model/value-map';
import {ViewProps, ViewPropsObject} from '../model/view-props';
import {ClassName} from './class-name';

function compose<A, B, C>(
	h1: (input: A) => B,
	h2: (input: B) => C,
): (input: A) => C {
	return (input) => h2(h1(input));
}

function extractValue<T>(ev: SingleValueEvents<T>['change']): T {
	return ev.rawValue;
}

function applyClass(elem: HTMLElement, className: string, active: boolean) {
	if (active) {
		elem.classList.add(className);
	} else {
		elem.classList.remove(className);
	}
}

const className = ClassName('');

function valueToModifier(
	elem: HTMLElement,
	modifier: string,
): (value: boolean) => void {
	return (value) => {
		applyClass(elem, className(undefined, modifier), value);
	};
}

function bindViewProps<Key extends keyof ViewPropsObject>(
	viewProps: ViewProps,
	key: Key,
	applyValue: (value: ViewPropsObject[Key]) => void,
) {
	viewProps.valueEmitter(key).on('change', compose(extractValue, applyValue));
	applyValue(viewProps.get(key));
}

export function bindClassModifier(viewProps: ViewProps, elem: HTMLElement) {
	bindViewProps(viewProps, 'disabled', valueToModifier(elem, 'disabled'));
	bindViewProps(viewProps, 'hidden', valueToModifier(elem, 'hidden'));
}

interface Disableable {
	disabled: boolean;
}

export function bindDisabled(viewProps: ViewProps, target: Disableable) {
	bindViewProps(viewProps, 'disabled', (disabled: boolean) => {
		target.disabled = disabled;
	});
}

export function bindTabIndex(viewProps: ViewProps, elem: HTMLOrSVGElement) {
	bindViewProps(viewProps, 'disabled', (disabled: boolean) => {
		elem.tabIndex = disabled ? -1 : 0;
	});
}
