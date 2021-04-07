import {Controller} from '../../../common/controller/controller';
import {disposeElement} from '../../../common/disposing-util';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {Blade, BladeEvents} from '../model/blade';
import {getAllBladePositions} from '../model/blade-positions';
import {BladeRack} from '../model/blade-rack';

interface Config<V extends View> {
	blade: Blade;
	view: V;
	viewProps: ViewProps;
}

const className = ClassName('');

export class BladeController<V extends View> implements Controller {
	public readonly blade: Blade;
	public readonly view: V;
	public readonly viewProps: ViewProps;
	private parent_: BladeRack | null = null;

	constructor(config: Config<V>) {
		this.blade = config.blade;
		this.view = config.view;
		this.viewProps = config.viewProps;

		const elem = this.view.element;
		this.blade.emitter.on('change', (ev: BladeEvents['change']) => {
			if (ev.propertyName === 'positions') {
				getAllBladePositions().forEach((pos) => {
					elem.classList.remove(className(undefined, pos));
				});
				this.blade.positions.forEach((pos) => {
					elem.classList.add(className(undefined, pos));
				});
			}
		});
		this.blade.emitter.on('dispose', () => {
			if (this.view.onDispose) {
				this.view.onDispose();
			}
			disposeElement(elem);

			this.onDispose();
		});
	}

	get parent(): BladeRack | null {
		return this.parent_;
	}

	public onDispose() {}
}
