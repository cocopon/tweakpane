import {insertElementAt, removeElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {TpError} from '../../../common/tp-error';
import {ContainerBladeController} from '../../common/controller/container-blade';
import {Blade} from '../../common/model/blade';
import {BladeRackEvents} from '../../common/model/blade-rack';
import {RackController} from '../../rack/controller/rack';
import {Tab} from '../model/tab';
import {TabView} from '../view/tab';
import {TabPageController} from './tab-page';

interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

export class TabController extends ContainerBladeController<TabView> {
	public readonly tab: Tab;

	constructor(doc: Document, config: Config) {
		const cr = new RackController(doc, {
			blade: config.blade,
			viewProps: config.viewProps,
		});
		const tab = new Tab();
		super({
			blade: config.blade,
			rackController: cr,
			view: new TabView(doc, {
				contentsElement: cr.view.element,
				empty: tab.empty,
				viewProps: config.viewProps,
			}),
		});

		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		const rack = this.rackController.rack;
		rack.emitter.on('add', this.onRackAdd_);
		rack.emitter.on('remove', this.onRackRemove_);

		this.tab = tab;
	}

	public add(pc: TabPageController, opt_index?: number): void {
		this.rackController.rack.add(pc, opt_index);
	}

	public remove(index: number): void {
		this.rackController.rack.remove(this.rackController.rack.children[index]);
	}

	private onRackAdd_(ev: BladeRackEvents['add']): void {
		if (!ev.isRoot) {
			return;
		}

		const pc = ev.bladeController;
		/* istanbul ignore next */
		if (!(pc instanceof TabPageController)) {
			throw TpError.shouldNeverHappen();
		}

		insertElementAt(
			this.view.itemsElement,
			pc.itemController.view.element,
			ev.index,
		);
		pc.itemController.viewProps.set('parent', this.viewProps);

		this.tab.add(pc.props.value('selected'));
	}

	private onRackRemove_(ev: BladeRackEvents['remove']): void {
		if (!ev.isRoot) {
			return;
		}

		const pc = ev.bladeController;
		/* istanbul ignore next */
		if (!(pc instanceof TabPageController)) {
			throw TpError.shouldNeverHappen();
		}

		removeElement(pc.itemController.view.element);
		pc.itemController.viewProps.set('parent', null);

		this.tab.remove(pc.props.value('selected'));
	}
}
