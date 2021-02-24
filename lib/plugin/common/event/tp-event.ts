export class TpChangeEvent<T> {
	public readonly presetKey: string;
	public readonly value: T;

	constructor(value: T, presetKey: string) {
		this.value = value;
		this.presetKey = presetKey;
	}
}

export class TpUpdateEvent<T> {
	public readonly presetKey: string;
	public readonly value: T;

	constructor(value: T, presetKey: string) {
		this.value = value;
		this.presetKey = presetKey;
	}
}

export class TpFoldEvent {
	public readonly expanded: boolean;

	constructor(expanded: boolean) {
		this.expanded = expanded;
	}
}
