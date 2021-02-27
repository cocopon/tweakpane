export class TpEvent {
	public readonly target: unknown;

	constructor(target: unknown) {
		this.target = target;
	}
}

export class TpChangeEvent<T> extends TpEvent {
	public readonly presetKey: string;
	public readonly value: T;

	constructor(target: unknown, value: T, presetKey: string) {
		super(target);

		this.value = value;
		this.presetKey = presetKey;
	}
}

export class TpUpdateEvent<T> extends TpEvent {
	public readonly presetKey: string;
	public readonly value: T;

	constructor(target: unknown, value: T, presetKey: string) {
		super(target);

		this.value = value;
		this.presetKey = presetKey;
	}
}

export class TpFoldEvent extends TpEvent {
	public readonly expanded: boolean;

	constructor(target: unknown, expanded: boolean) {
		super(target);

		this.expanded = expanded;
	}
}
