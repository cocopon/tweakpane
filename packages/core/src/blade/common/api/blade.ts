import {BladeController} from '../controller/blade';
import {BladeState} from '../controller/blade-state';

export class BladeApi<C extends BladeController = BladeController> {
	/**
	 * @hidden
	 */
	protected readonly controller_: C;

	/**
	 * @hidden
	 */
	constructor(controller: C) {
		this.controller_ = controller;
	}

	get element(): HTMLElement {
		return this.controller_.view.element;
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller_.viewProps.set('disposed', true);
	}

	public importState(state: BladeState): boolean {
		return this.controller_.importState(state);
	}

	public exportState(): BladeState {
		return this.controller_.exportState();
	}
}
