import {ClassName} from '../view/class-name.js';
import {valueToClassName} from '../view/reactive.js';
import {bindValue, bindValueMap} from './reactive.js';
import {ReadonlyValue, Value, ValueEvents} from './value.js';
import {ValueMap, ValueMapEvents} from './value-map.js';
import {SetRawValue} from './values.js';
import {createReadonlyValue, createValue} from './values.js';

export type ViewPropsObject = {
	disabled: boolean;
	disposed: boolean;
	hidden: boolean;
	parent: ViewProps | null;
};

export type ViewPropsEvents = ValueMapEvents<ViewPropsObject>;

const cn = ClassName('');

function valueToModifier(
	elem: HTMLElement,
	modifier: string,
): (value: boolean) => void {
	return valueToClassName(elem, cn(undefined, modifier));
}

interface Disableable {
	disabled: boolean;
}

interface ViewPropsState {
	disabled: boolean;
	hidden: boolean;
}

export class ViewProps extends ValueMap<ViewPropsObject> {
	private readonly globalDisabled_: ReadonlyValue<boolean>;
	private readonly setGlobalDisabled_: SetRawValue<boolean>;

	/**
	 * @hidden
	 */
	constructor(valueMap: {
		[Key in keyof ViewPropsObject]: Value<ViewPropsObject[Key]>;
	}) {
		super(valueMap);

		this.onDisabledChange_ = this.onDisabledChange_.bind(this);
		this.onParentChange_ = this.onParentChange_.bind(this);
		this.onParentGlobalDisabledChange_ =
			this.onParentGlobalDisabledChange_.bind(this);

		[this.globalDisabled_, this.setGlobalDisabled_] = createReadonlyValue(
			createValue(this.getGlobalDisabled_()),
		);

		this.value('disabled').emitter.on('change', this.onDisabledChange_);
		this.value('parent').emitter.on('change', this.onParentChange_);
		this.get('parent')?.globalDisabled.emitter.on(
			'change',
			this.onParentGlobalDisabledChange_,
		);
	}

	public static create(opt_initialValue?: Partial<ViewPropsObject>): ViewProps {
		const initialValue: Partial<ViewPropsObject> = opt_initialValue ?? {};
		return new ViewProps(
			ValueMap.createCore<ViewPropsObject>({
				disabled: initialValue.disabled ?? false,
				disposed: false,
				hidden: initialValue.hidden ?? false,
				parent: initialValue.parent ?? null,
			}),
		);
	}

	get globalDisabled(): ReadonlyValue<boolean> {
		return this.globalDisabled_;
	}

	public bindClassModifiers(elem: HTMLElement): void {
		bindValue(this.globalDisabled_, valueToModifier(elem, 'disabled'));
		bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
	}

	public bindDisabled(target: Disableable): void {
		bindValue(this.globalDisabled_, (disabled) => {
			target.disabled = disabled;
		});
	}

	public bindTabIndex(elem: HTMLOrSVGElement): void {
		bindValue(this.globalDisabled_, (disabled) => {
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

	public importState(state: ViewPropsState): void {
		this.set('disabled', state.disabled);
		this.set('hidden', state.hidden);
	}

	public exportState(): ViewPropsState {
		return {
			disabled: this.get('disabled'),
			hidden: this.get('hidden'),
		};
	}

	/**
	 * Gets a global disabled of the view.
	 * Disabled of the view will be affected by its disabled and its parent disabled.
	 */
	private getGlobalDisabled_(): boolean {
		const parent = this.get('parent');
		const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
		return parentDisabled || this.get('disabled');
	}

	private updateGlobalDisabled_(): void {
		this.setGlobalDisabled_(this.getGlobalDisabled_());
	}

	private onDisabledChange_(): void {
		this.updateGlobalDisabled_();
	}

	private onParentGlobalDisabledChange_(): void {
		this.updateGlobalDisabled_();
	}

	private onParentChange_(ev: ValueEvents<ViewProps | null>['change']): void {
		const prevParent = ev.previousRawValue;
		prevParent?.globalDisabled.emitter.off(
			'change',
			this.onParentGlobalDisabledChange_,
		);
		this.get('parent')?.globalDisabled.emitter.on(
			'change',
			this.onParentGlobalDisabledChange_,
		);

		this.updateGlobalDisabled_();
	}
}
