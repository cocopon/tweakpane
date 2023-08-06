import {Controller} from '../../../common/controller/controller.js';
import {removeElement} from '../../../common/dom-util.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {Blade} from '../model/blade.js';
import {BladePosition, getAllBladePositions} from '../model/blade-positions.js';
import {Rack} from '../model/rack.js';
import {BladeState, exportBladeState, importBladeState} from './blade-state.js';

/**
 * @hidden
 */
interface Config<V extends View> {
	blade: Blade;
	view: V;
	viewProps: ViewProps;
}

const cn = ClassName('');
const POS_TO_CLASS_NAME_MAP: {[pos in BladePosition]: string} = {
	veryfirst: 'vfst',
	first: 'fst',
	last: 'lst',
	verylast: 'vlst',
};

/**
 * @hidden
 */
export class BladeController<V extends View = View> implements Controller<V> {
	public readonly blade: Blade;
	public readonly view: V;
	public readonly viewProps: ViewProps;
	private parent_: Rack | null = null;

	constructor(config: Config<V>) {
		this.blade = config.blade;
		this.view = config.view;
		this.viewProps = config.viewProps;

		const elem = this.view.element;
		this.blade.value('positions').emitter.on('change', () => {
			getAllBladePositions().forEach((pos) => {
				elem.classList.remove(cn(undefined, POS_TO_CLASS_NAME_MAP[pos]));
			});
			this.blade.get('positions').forEach((pos) => {
				elem.classList.add(cn(undefined, POS_TO_CLASS_NAME_MAP[pos]));
			});
		});

		this.viewProps.handleDispose(() => {
			removeElement(elem);
		});
	}

	get parent(): Rack | null {
		return this.parent_;
	}

	set parent(parent: Rack | null) {
		this.parent_ = parent;
		this.viewProps.set('parent', this.parent_ ? this.parent_.viewProps : null);
	}

	/**
	 * Import a state from the object.
	 * @param state The object to import.
	 * @return true if succeeded, false otherwise.
	 */
	public importState(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				disabled: p.required.boolean,
				hidden: p.required.boolean,
			}),
			(result) => {
				this.viewProps.importState(result);
				return true;
			},
		);
	}

	/**
	 * Export a state to the object.
	 * @return A state object.
	 */
	public exportState(): BladeState {
		return exportBladeState(null, {
			...this.viewProps.exportState(),
		});
	}
}
