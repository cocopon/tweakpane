import {SeparatorController} from '../plugin/blade/separator/controller';
import {BladeApi} from './blade-api';

export class SeparatorApi implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller: SeparatorController;

	/**
	 * @hidden
	 */
	constructor(controller: SeparatorController) {
		this.controller = controller;
	}

	get hidden(): boolean {
		return this.controller.blade.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.blade.hidden = hidden;
	}

	public dispose(): void {
		this.controller.blade.dispose();
	}
}
