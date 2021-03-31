import {SeparatorController} from '../plugin/blade/separator/controller';
import {BladeApi} from './blade-api';

export class SeparatorApi implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller_: SeparatorController;

	/**
	 * @hidden
	 */
	constructor(controller: SeparatorController) {
		this.controller_ = controller;
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller_.blade.dispose();
	}
}
