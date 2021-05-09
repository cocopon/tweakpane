export type BladePosition = 'veryfirst' | 'first' | 'last' | 'verylast';

export function getAllBladePositions(): BladePosition[] {
	return ['veryfirst', 'first', 'last', 'verylast'];
}
