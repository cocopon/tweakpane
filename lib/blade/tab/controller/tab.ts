import {insertElementAt, removeElement} from '../../../common/dom-util';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {BladeRackController} from '../../blade-rack/controller/blade-rack';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {
	NestedOrderedSet,
	NestedOrderedSetEvents,
} from '../../common/model/nested-ordered-set';
import {TabView} from '../view/tab';
import {TabItemEvents} from './tab-item';
import {TabPageController} from './tab-page';

interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

export interface TabPageParams {
	title: string;

	index?: number;
}

export class TabController extends BladeController<TabView> {
	private readonly contentsRc_: BladeRackController;
	private readonly pageSet_: NestedOrderedSet<TabPageController>;
	private readonly sel_: Value<number>;

	constructor(doc: Document, config: Config) {
		const cr = new BladeRackController(doc, {
			blade: config.blade,
			viewProps: config.viewProps,
		});
		super({
			blade: config.blade,
			view: new TabView(doc, {
				contentsElement: cr.view.element,
				viewProps: config.viewProps,
			}),
			viewProps: config.viewProps,
		});

		this.onItemClick_ = this.onItemClick_.bind(this);
		this.onPageAdd_ = this.onPageAdd_.bind(this);
		this.onPageRemove_ = this.onPageRemove_.bind(this);
		this.onSelectionChange_ = this.onSelectionChange_.bind(this);

		this.pageSet_ = new NestedOrderedSet(() => null);
		this.pageSet_.emitter.on('add', this.onPageAdd_);
		this.pageSet_.emitter.on('remove', this.onPageRemove_);

		this.contentsRc_ = cr;

		this.sel_ = new PrimitiveValue(0);
		this.sel_.emitter.on('change', this.onSelectionChange_);
		this.applySelection_();
	}

	get pageSet(): NestedOrderedSet<TabPageController> {
		return this.pageSet_;
	}

	get rackController(): BladeRackController {
		return this.contentsRc_;
	}

	public add(pc: TabPageController, opt_index?: number): void {
		this.pageSet_.add(pc, opt_index ?? this.pageSet_.items.length);
	}

	public remove(index: number): void {
		this.pageSet_.remove(this.pageSet_.items[index]);
	}

	private onItemClick_(ev: TabItemEvents['click']) {
		const index = this.pageSet_.items.findIndex(
			(pc) => pc.itemController === ev.sender,
		);
		if (index < 0) {
			return;
		}
		this.sel_.rawValue = index;
	}

	private onPageAdd_(
		ev: NestedOrderedSetEvents<TabPageController>['add'],
	): void {
		const pc = ev.item;
		pc.itemController.emitter.on('click', this.onItemClick_);
		insertElementAt(
			this.view.itemsElement,
			pc.itemController.view.element,
			ev.index,
		);
		this.contentsRc_.rack.add(pc.contentController, ev.index);
		this.applySelection_();
	}

	private onPageRemove_(
		ev: NestedOrderedSetEvents<TabPageController>['remove'],
	): void {
		const pc = ev.item;
		removeElement(pc.itemController.view.element);
		this.contentsRc_.rack.remove(pc.contentController);
	}

	private applySelection_() {
		this.pageSet_.items.forEach((pc, index) => {
			pc.props.set('selected', index === this.sel_.rawValue);
		});
	}

	private onSelectionChange_() {
		this.applySelection_();
	}
}
