export const TestUtil = {
	createEvent: (
		win: Window,
		type: string,
		options?: Record<string, unknown>,
	): Event => {
		return options
			? new (win as any).Event(type, options)
			: new (win as any).Event(type);
	},

	createKeyboardEvent: (
		win: Window,
		type: string,
		options: Record<string, unknown>,
	): Event => {
		return new (win as any).KeyboardEvent(type, options);
	},

	closeTo: (actual: number, expected: number, delta: number): boolean => {
		return Math.abs(actual - expected) < delta;
	},
};
