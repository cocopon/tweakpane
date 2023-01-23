import {ClassName} from '../view/class-name';
import {valueToClassName} from '../view/reactive';
import {bindValueMap} from './reactive';
import {ReadonlyValue, SetRawValue} from './readonly-value';
import {Value, ValueEvents} from './value';
import {ValueMap, ValueMapEvents} from './value-map';
import {createValue} from './values';

export type ViewPropsObject = {
	disabled: boolean;
	disposed: boolean;
	hidden: boolean;
	parent: ViewProps | null;
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
	private readonly effectiveDisabled_: ReadonlyValue<boolean>;
	private readonly setEffectiveDisabled_: SetRawValue<boolean>;

	constructor(valueMap: {
		[Key in keyof ViewPropsObject]: Value<ViewPropsObject[Key]>;
	}) {
		super(valueMap);

		this.onDisabledChange_ = this.onDisabledChange_.bind(this);
		this.onParentChange_ = this.onParentChange_.bind(this);
		this.onParentEffectiveDisabledChange_ =
			this.onParentEffectiveDisabledChange_.bind(this);

		[this.effectiveDisabled_, this.setEffectiveDisabled_] =
			ReadonlyValue.create(createValue(this.getEffectiveDisabled_()));

		this.value('disabled').emitter.on('change', this.onDisabledChange_);
		this.value('parent').emitter.on('change', this.onParentChange_);
		this.get('parent')?.effectiveDisabled.emitter.on(
			'change',
			this.onParentEffectiveDisabledChange_,
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

	get effectiveDisabled(): ReadonlyValue<boolean> {
		return this.effectiveDisabled_;
	}

	public bindClassModifiers(elem: HTMLElement): void {
		bindValueMap(this, 'disabled', valueToModifier(elem, 'disabled'));
		bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
	}

	public bindDisabled(target: Disableable): void {
		this.effectiveDisabled_.emitter.on('change', (ev) => {
			target.disabled = ev.rawValue;
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

	/**
	 * Gets an effective disabled of the view.
	 * Disabled of the view will be affected by its disabled and its parent disabled.
	 */
	private getEffectiveDisabled_(): boolean {
		const parent = this.get('parent');
		const parentDisabled = parent ? parent.effectiveDisabled.rawValue : false;
		return parentDisabled || this.get('disabled');
	}

	private updateEffectiveDisabled_(): void {
		this.setEffectiveDisabled_(this.getEffectiveDisabled_());
	}

	private onDisabledChange_(): void {
		this.updateEffectiveDisabled_();
	}

	private onParentEffectiveDisabledChange_(): void {
		this.updateEffectiveDisabled_();
	}

	private onParentChange_(ev: ValueEvents<ViewProps | null>['change']): void {
		const prevParent = ev.previousRawValue;
		prevParent?.effectiveDisabled.emitter.off(
			'change',
			this.onParentEffectiveDisabledChange_,
		);
		this.get('parent')?.effectiveDisabled.emitter.on(
			'change',
			this.onParentEffectiveDisabledChange_,
		);

		this.updateEffectiveDisabled_();
	}
}
