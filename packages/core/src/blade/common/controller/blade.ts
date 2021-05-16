import {Controller} from '../../../common/controller/controller';
import {disposeElement} from '../../../common/disposing-util';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {Blade} from '../model/blade';
import {BladePosition, getAllBladePositions} from '../model/blade-positions';
import {BladeRack} from '../model/blade-rack';

interface Config<V extends View> {
	blade: Blade;
	view: V;
	viewProps: ViewProps;
}

const className = ClassName('');
const POS_TO_CLASS_NAME_MAP: {[pos in BladePosition]: string} = {
	veryfirst: 'vfst',
	first: 'fst',
	last: 'lst',
	verylast: 'vlst',
};

export class BladeController<V extends View> implements Controller<V> {
	public readonly blade: Blade;
	public readonly view: V;
	public readonly viewProps: ViewProps;
	private parent_: BladeRack | null = null;

	constructor(config: Config<V>) {
		this.blade = config.blade;
		this.view = config.view;
		this.viewProps = config.viewProps;

		const elem = this.view.element;
		this.blade.value('positions').emitter.on('change', () => {
			getAllBladePositions().forEach((pos) => {
				elem.classList.remove(className(undefined, POS_TO_CLASS_NAME_MAP[pos]));
			});
			this.blade.get('positions').forEach((pos) => {
				elem.classList.add(className(undefined, POS_TO_CLASS_NAME_MAP[pos]));
			});
		});

		this.viewProps.handleDispose(() => {
			disposeElement(elem);
		});
	}

	get parent(): BladeRack | null {
		return this.parent_;
	}
}
