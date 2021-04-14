import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {RackController} from '../../rack/controller/rack';
import {Blade} from '../model/blade';
import {BladeController} from './blade';

interface Config<V extends View> {
	blade: Blade;
	rackController: RackController;
	view: V;
	viewProps: ViewProps;
}

export class RackLikeController<V extends View> extends BladeController<V> {
	public readonly rackController: RackController;

	constructor(config: Config<V>) {
		super({
			blade: config.blade,
			view: config.view,
			viewProps: config.viewProps,
		});
		this.rackController = config.rackController;
	}
}
