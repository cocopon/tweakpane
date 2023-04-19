import {View} from '../../../common/view/view.js';
import {Blade} from '../model/blade.js';
import {BladeController} from './blade.js';
import {BladeState, exportBladeState, importBladeState} from './blade-state.js';
import {RackController} from './rack.js';

/**
 * @hidden
 */
interface Config<V extends View> {
	blade: Blade;
	rackController: RackController;
	view: V;
}

/**
 * @hidden
 */
export class ContainerBladeController<
	V extends View = View,
> extends BladeController<V> {
	public readonly rackController: RackController;

	constructor(config: Config<V>) {
		super({
			blade: config.blade,
			view: config.view,
			viewProps: config.rackController.viewProps,
		});
		this.rackController = config.rackController;
	}

	public importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				children: p.required.array(p.required.raw),
			}),
			(result) => {
				return this.rackController.rack.children.every((c, index) => {
					return c.importState(result.children[index] as BladeState);
				});
			},
		);
	}

	public exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			children: this.rackController.rack.children.map((c) => c.exportState()),
		});
	}
}

export function isContainerBladeController(
	bc: BladeController,
): bc is ContainerBladeController {
	return 'rackController' in bc;
}
