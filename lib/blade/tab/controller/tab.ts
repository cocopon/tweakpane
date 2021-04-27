import {insertElementAt, removeElement} from '../../../common/dom-util';
import {Value, ValueEvents} from '../../../common/model/value';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {RackLikeController} from '../../common/controller/rack-like';
import {Blade} from '../../common/model/blade';
import {
	NestedOrderedSet,
	NestedOrderedSetEvents,
} from '../../common/model/nested-ordered-set';
import {RackController} from '../../rack/controller/rack';
import {TabView} from '../view/tab';
import {TabPageController} from './tab-page';

interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

export interface TabPageParams {
	title: string;

	index?: number;
}

export class TabController extends RackLikeController<TabView> {
	private readonly pageSet_: NestedOrderedSet<TabPageController>;
	private readonly empty_: Value<boolean>;

	constructor(doc: Document, config: Config) {
		const cr = new RackController(doc, {
			blade: config.blade,
			viewProps: config.viewProps,
		});
		const empty = createValue<boolean>(true);
		super({
			blade: config.blade,
			rackController: cr,
			view: new TabView(doc, {
				contentsElement: cr.view.element,
				empty: empty,
				viewProps: config.viewProps,
			}),
		});

		this.onPageAdd_ = this.onPageAdd_.bind(this);
		this.onPageRemove_ = this.onPageRemove_.bind(this);
		this.onPageSelectedChange_ = this.onPageSelectedChange_.bind(this);

		this.pageSet_ = new NestedOrderedSet(() => null);
		this.pageSet_.emitter.on('add', this.onPageAdd_);
		this.pageSet_.emitter.on('remove', this.onPageRemove_);

		this.empty_ = empty;
		this.applyPages_();
	}

	get pageSet(): NestedOrderedSet<TabPageController> {
		return this.pageSet_;
	}

	public add(pc: TabPageController, opt_index?: number): void {
		this.pageSet_.add(pc, opt_index ?? this.pageSet_.items.length);
	}

	public remove(index: number): void {
		this.pageSet_.remove(this.pageSet_.items[index]);
	}

	private applyPages_(): void {
		this.keepSelection_();
		this.empty_.rawValue = this.pageSet_.items.length === 0;
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

		pc.props.value('selected').emitter.on('change', this.onPageSelectedChange_);
		this.applyPages_();
	}

	private onPageRemove_(
		ev: NestedOrderedSetEvents<TabPageController>['remove'],
	): void {
		const pc = ev.item;
		removeElement(pc.itemController.view.element);
		this.rackController.rack.remove(pc.contentController);

		pc.props
			.value('selected')
			.emitter.off('change', this.onPageSelectedChange_);
		this.applyPages_();
	}

	private keepSelection_(): void {
		if (this.pageSet_.items.length === 0) {
			return;
		}

		const firstSelIndex = this.pageSet_.items.findIndex((pc) =>
			pc.props.get('selected'),
		);
		if (firstSelIndex < 0) {
			this.pageSet_.items.forEach((pc, i) => {
				pc.props.set('selected', i === 0);
			});
		} else {
			this.pageSet_.items.forEach((pc, i) => {
				pc.props.set('selected', i === firstSelIndex);
			});
		}
	}

	private onPageSelectedChange_(ev: ValueEvents<boolean>['change']): void {
		if (ev.rawValue) {
			const index = this.pageSet_.items.findIndex(
				(pc) => pc.props.value('selected') === ev.sender,
			);
			this.pageSet_.items.forEach((pc, i) => {
				pc.props.set('selected', i === index);
			});
		} else {
			this.keepSelection_();
		}
	}
}
