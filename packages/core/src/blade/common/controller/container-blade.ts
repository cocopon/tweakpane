import {View} from '../../../common/view/view';
import {Blade} from '../model/blade';
import {
	BladeController,
	BladeControllerState,
	importBladeControllerState,
} from './blade';
import {RackController} from './rack';

interface Config<V extends View> {
	blade: Blade;
	rackController: RackController;
	view: V;
}

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

	public import(state: BladeControllerState): boolean {
		return importBladeControllerState(
			state,
			(s) => super.import(s),
			(p) => ({
				children: p.required.array(p.required.raw),
			}),
			(result) => {
				return this.rackController.rack.children.every((c, index) => {
					return c.import(result.children[index] as BladeControllerState);
				});
			},
		);
	}

	public export(): BladeControllerState {
		return {
			...super.export(),
			children: this.rackController.rack.children.map((c) => c.export()),
		};
	}
}

export function isContainerBladeController(
	bc: BladeController,
): bc is ContainerBladeController {
	return 'rackController' in bc;
}
