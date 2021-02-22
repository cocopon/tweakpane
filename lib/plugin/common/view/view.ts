/**
 * @hidden
 */
export interface View {
	readonly element: HTMLElement;

	onDispose?(): void;
}
