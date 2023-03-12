/**
 * A view interface.
 */
export interface View {
	/**
	 * A root element of the view.
	 */
	readonly element: HTMLElement;
}

/**
 * @hidden
 */
export interface InputView extends View {
	readonly inputElement: HTMLInputElement;
}
