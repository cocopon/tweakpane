import {insertElementAt, removeElement} from '../../../common/dom-util.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {Blade} from '../model/blade.js';
import {Rack, RackEvents} from '../model/rack.js';

/**
 * @hidden
 */
interface Config {
	blade: Blade;
	element: HTMLElement;
	viewProps: ViewProps;

	root?: boolean;
}

/**
 * @hidden
 */
export class RackController {
	public readonly element: HTMLElement;
	public readonly rack: Rack;
	public readonly viewProps: ViewProps;

	constructor(config: Config) {
		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		this.element = config.element;
		this.viewProps = config.viewProps;

		const rack = new Rack({
			blade: config.root ? undefined : config.blade,
			viewProps: config.viewProps,
		});
		rack.emitter.on('add', this.onRackAdd_);
		rack.emitter.on('remove', this.onRackRemove_);
		this.rack = rack;

		this.viewProps.handleDispose(() => {
			for (let i = this.rack.children.length - 1; i >= 0; i--) {
				const bc = this.rack.children[i];
				bc.viewProps.set('disposed', true);
			}
		});
	}

	private onRackAdd_(ev: RackEvents['add']): void {
		if (!ev.root) {
			return;
		}
		insertElementAt(this.element, ev.bladeController.view.element, ev.index);
	}

	private onRackRemove_(ev: RackEvents['remove']): void {
		if (!ev.root) {
			return;
		}
		removeElement(ev.bladeController.view.element);
	}
}
