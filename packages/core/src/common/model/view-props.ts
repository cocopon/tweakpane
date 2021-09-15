import {ClassName} from '../view/class-name';
import {valueToClassName} from '../view/reactive';
import {bindValueMap} from './reactive';
import {Value} from './value';
import {ValueMap, ValueMapEvents} from './value-map';

export type ViewPropsObject = {
	disabled: boolean;
	disposed: boolean;
	hidden: boolean;
};

export type ViewPropsEvents = ValueMapEvents<ViewPropsObject>;

const className = ClassName('');
function valueToModifier(
	elem: HTMLElement,
	modifier: string,
): (value: boolean) => void {
	return valueToClassName(elem, className(undefined, modifier));
}

interface Disableable {
	disabled: boolean;
}

export class ViewProps extends ValueMap<ViewPropsObject> {
	constructor(valueMap: {
		[Key in keyof ViewPropsObject]: Value<ViewPropsObject[Key]>;
	}) {
		super(valueMap);
	}

	public static create(opt_initialValue?: Partial<ViewPropsObject>): ViewProps {
		const initialValue: Partial<ViewPropsObject> = opt_initialValue ?? {};
		const coreObj = {
			disabled: initialValue.disabled ?? false,
			disposed: false,
			hidden: initialValue.hidden ?? false,
		};
		const core = ValueMap.createCore(coreObj);
		return new ViewProps(core);
	}

	public bindClassModifiers(elem: HTMLElement): void {
		bindValueMap(this, 'disabled', valueToModifier(elem, 'disabled'));
		bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
	}

	public bindDisabled(target: Disableable): void {
		bindValueMap(this, 'disabled', (disabled: boolean) => {
			target.disabled = disabled;
		});
	}

	public bindTabIndex(elem: HTMLOrSVGElement): void {
		bindValueMap(this, 'disabled', (disabled: boolean) => {
			elem.tabIndex = disabled ? -1 : 0;
		});
	}

	public handleDispose(callback: () => void): void {
		this.value('disposed').emitter.on('change', (disposed) => {
			if (disposed) {
				callback();
			}
		});
	}
}
