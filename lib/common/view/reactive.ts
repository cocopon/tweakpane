import {warnDeprecation} from '../compat';
import {
	bindValue as bindValueV3,
	bindValueMap as bindValueMapV3,
} from '../model/reactive';
import {Value} from '../model/value';
import {ValueMap} from '../model/value-map';
import {ViewProps} from '../model/view-props';

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

/** @deprecated */
export function bindValue<T>(value: Value<T>, applyValue: (value: T) => void) {
	warnDeprecation({
		name: bindValue.name,
		postscript: 'It is moved to `common/model/reactive`',
	});
	bindValueV3(value, applyValue);
}

/** @deprecated */
export function bindValueMap<
	O extends Record<string, unknown>,
	Key extends keyof O
>(valueMap: ValueMap<O>, key: Key, applyValue: (value: O[Key]) => void) {
	warnDeprecation({
		name: bindValueMap.name,
		postscript: 'It is moved to `common/model/reactive`',
	});
	bindValueMapV3(valueMap, key, applyValue);
}

/** @deprecated */
export function bindClassModifier(viewProps: ViewProps, elem: HTMLElement) {
	warnDeprecation({
		name: bindClassModifier.name,
		alternative: 'ViewProps.bindClassModifiers',
	});
	viewProps.bindClassModifiers(elem);
}

interface Disableable {
	disabled: boolean;
}

/** @deprecated */
export function bindDisabled(viewProps: ViewProps, target: Disableable) {
	warnDeprecation({
		name: bindDisabled.name,
		alternative: 'ViewProps.bindDisabled',
	});
	viewProps.bindDisabled(target);
}

/** @deprecated */
export function bindTabIndex(viewProps: ViewProps, elem: HTMLOrSVGElement) {
	warnDeprecation({
		name: bindTabIndex.name,
		alternative: 'ViewProps.bindTabIndex',
	});
	viewProps.bindTabIndex(elem);
}

export function bindValueToTextContent(
	value: Value<string | undefined>,
	elem: HTMLElement,
) {
	bindValueV3(value, (text) => {
		elem.textContent = text ?? '';
	});
}

/** @deprecated */
export function bindTextContent<
	Key extends string,
	O extends {
		[key in Key]: string | undefined;
	}
>(valueMap: ValueMap<O>, key: Key, elem: HTMLElement) {
	warnDeprecation({
		name: bindTextContent.name,
		alternative: bindValueToTextContent.name,
	});
	bindValueMapV3(valueMap, key, (text) => {
		elem.textContent = text ?? '';
	});
}

/** @deprecated */
export function bindDisposed(viewProps: ViewProps, callback: () => void): void {
	warnDeprecation({
		name: bindDisposed.name,
		alternative: 'ViewProps.handleDispose',
	});
	viewProps.handleDispose(callback);
}
