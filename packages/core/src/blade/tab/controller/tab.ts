import {insertElementAt, removeElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {RackLikeController} from '../../common/controller/rack-like';
import {Blade} from '../../common/model/blade';
import {
	NestedOrderedSet,
	NestedOrderedSetEvents,
} from '../../common/model/nested-ordered-set';
import {RackController} from '../../rack/controller/rack';
import {Tab} from '../model/tab';
import {TabView} from '../view/tab';
import {TabPageController} from './tab-page';

interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

export class TabController extends RackLikeController<TabView> {
	private readonly pageSet_: NestedOrderedSet<TabPageController>;
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

		this.onPageAdd_ = this.onPageAdd_.bind(this);
		this.onPageRemove_ = this.onPageRemove_.bind(this);

		this.pageSet_ = new NestedOrderedSet(() => null);
		this.pageSet_.emitter.on('add', this.onPageAdd_);
		this.pageSet_.emitter.on('remove', this.onPageRemove_);

		this.tab = tab;
	}

	get pageSet(): NestedOrderedSet<TabPageController> {
		return this.pageSet_;
	}

	public add(pc: TabPageController, opt_index?: number): void {
		this.pageSet_.add(pc, opt_index);
	}

	public remove(index: number): void {
		this.pageSet_.remove(this.pageSet_.items[index]);
	}

	private onPageAdd_(
		ev: NestedOrderedSetEvents<TabPageController>['add'],
	): void {
		const pc = ev.item;
		insertElementAt(
			this.view.itemsElement,
			pc.itemController.view.element,
			ev.index,
		);
		this.rackController.rack.add(pc.contentController, ev.index);

		this.tab.add(pc.props.value('selected'));
	}

	private onPageRemove_(
		ev: NestedOrderedSetEvents<TabPageController>['remove'],
	): void {
		const pc = ev.item;
		removeElement(pc.itemController.view.element);
		this.rackController.rack.remove(pc.contentController);

		this.tab.remove(pc.props.value('selected'));
	}
}
