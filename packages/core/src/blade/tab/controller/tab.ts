import {insertElementAt, removeElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {ContainerBladeController} from '../../common/controller/container-blade';
import {RackController} from '../../common/controller/rack';
import {Blade} from '../../common/model/blade';
import {RackEvents} from '../../common/model/rack';
import {Tab} from '../model/tab';
import {TabView} from '../view/tab';
import {TabPageController} from './tab-page';

/**
 * @hidden
 */
interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class TabController extends ContainerBladeController<TabView> {
	public readonly tab: Tab;

	constructor(doc: Document, config: Config) {
		const tab = new Tab();
		const view = new TabView(doc, {
			empty: tab.empty,
			viewProps: config.viewProps,
		});
		super({
			blade: config.blade,
			rackController: new RackController({
				blade: config.blade,
				element: view.contentsElement,
				viewProps: config.viewProps,
			}),
			view: view,
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

	private onRackAdd_(ev: RackEvents['add']): void {
		if (!ev.root) {
			return;
		}

		const pc = ev.bladeController as TabPageController;
		insertElementAt(
			this.view.itemsElement,
			pc.itemController.view.element,
			ev.index,
		);
		pc.itemController.viewProps.set('parent', this.viewProps);

		this.tab.add(pc.props.value('selected'));
	}

	private onRackRemove_(ev: RackEvents['remove']): void {
		if (!ev.root) {
			return;
		}

		const pc = ev.bladeController as TabPageController;
		removeElement(pc.itemController.view.element);
		pc.itemController.viewProps.set('parent', null);

		this.tab.remove(pc.props.value('selected'));
	}
}
