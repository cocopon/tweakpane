import {insertElementAt, removeElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {PlainView} from '../../../common/view/plain';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {BladeRack, BladeRackEvents} from '../../common/model/blade-rack';

interface Config {
	blade: Blade;
	viewProps: ViewProps;

	root?: boolean;
}

/**
 * @hidden
 */
export class RackController extends BladeController<PlainView> {
	public readonly rack: BladeRack;

	constructor(doc: Document, config: Config) {
		super({
			...config,
			view: new PlainView(doc, {
				viewName: 'brk',
				viewProps: config.viewProps,
			}),
		});

		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		const rack = new BladeRack(config.root ? undefined : config.blade);
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

	private onRackAdd_(ev: BladeRackEvents['add']): void {
		if (!ev.isRoot) {
			return;
		}
		insertElementAt(
			this.view.element,
			ev.bladeController.view.element,
			ev.index,
		);
	}

	private onRackRemove_(ev: BladeRackEvents['remove']): void {
		if (!ev.isRoot) {
			return;
		}
		removeElement(ev.bladeController.view.element);
	}
}
