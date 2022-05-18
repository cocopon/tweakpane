import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {TpError} from '../../../common/tp-error';
import {PluginPool} from '../../../plugin/pool';
import {RackLikeApi} from '../../common/api/rack-like-api';
import {
	TpChangeEvent,
	TpTabSelectEvent,
	TpUpdateEvent,
} from '../../common/api/tp-event';
import {NestedOrderedSetEvents} from '../../common/model/nested-ordered-set';
import {RackApi} from '../../rack/api/rack';
import {TabController} from '../controller/tab';
import {TabPageController, TabPagePropsObject} from '../controller/tab-page';
import {TabItemPropsObject} from '../view/tab-item';
import {TabPageApi} from './tab-page';

interface TabApiEvents {
	change: {
		event: TpChangeEvent<unknown>;
	};
	select: {
		event: TpTabSelectEvent;
	};
	update: {
		event: TpUpdateEvent<unknown>;
	};
}

export interface TabPageParams {
	title: string;

	index?: number;
}

export class TabApi extends RackLikeApi<TabController> {
	private readonly emitter_: Emitter<TabApiEvents>;
	private readonly pageApiMap_: Map<TabPageController, TabPageApi>;

	/**
	 * @hidden
	 */
	constructor(controller: TabController, pool: PluginPool) {
		super(controller, new RackApi(controller.rackController, pool));

		this.onPageAdd_ = this.onPageAdd_.bind(this);
		this.onPageRemove_ = this.onPageRemove_.bind(this);
		this.onSelect_ = this.onSelect_.bind(this);

		this.emitter_ = new Emitter();
		this.pageApiMap_ = new Map();

		this.rackApi_.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: ev,
			});
		});
		this.rackApi_.on('update', (ev) => {
			this.emitter_.emit('update', {
				event: ev,
			});
		});

		this.controller_.tab.selectedIndex.emitter.on('change', this.onSelect_);
		this.controller_.pageSet.emitter.on('add', this.onPageAdd_);
		this.controller_.pageSet.emitter.on('remove', this.onPageRemove_);

		this.controller_.pageSet.items.forEach((pc) => {
			this.setUpPageApi_(pc);
		});
	}

	get pages(): TabPageApi[] {
		return this.controller_.pageSet.items.map((pc) => {
			const api = this.pageApiMap_.get(pc);
			/* istanbul ignore next */
			if (!api) {
				throw TpError.shouldNeverHappen();
			}
			return api;
		});
	}

	public addPage(params: TabPageParams): TabPageApi {
		const doc = this.controller_.view.element.ownerDocument;
		const pc = new TabPageController(doc, {
			itemProps: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: params.title,
			}),
			props: ValueMap.fromObject<TabPagePropsObject>({
				selected: false,
			}),
		});
		this.controller_.add(pc, params.index);

		const api = this.pageApiMap_.get(pc);
		/* istanbul ignore next */
		if (!api) {
			throw TpError.shouldNeverHappen();
		}
		return api;
	}

	public removePage(index: number): void {
		this.controller_.remove(index);
	}

	public on<EventName extends keyof TabApiEvents>(
		eventName: EventName,
		handler: (ev: TabApiEvents[EventName]['event']) => void,
	): TabApi {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}

	private setUpPageApi_(pc: TabPageController) {
		const rackApi = this.rackApi_['apiSet_'].find(
			(api) => api.controller_ === pc.contentController,
		) as RackApi | null;
		if (!rackApi) {
			throw TpError.shouldNeverHappen();
		}

		const api = new TabPageApi(pc, rackApi);
		this.pageApiMap_.set(pc, api);
	}

	private onPageAdd_(ev: NestedOrderedSetEvents<TabPageController>['add']) {
		this.setUpPageApi_(ev.item);
	}

	private onPageRemove_(
		ev: NestedOrderedSetEvents<TabPageController>['remove'],
	) {
		const api = this.pageApiMap_.get(ev.item);
		/* istanbul ignore next */
		if (!api) {
			throw TpError.shouldNeverHappen();
		}
		this.pageApiMap_.delete(ev.item);
	}

	private onSelect_(ev: ValueEvents<number>['change']) {
		this.emitter_.emit('select', {
			event: new TpTabSelectEvent(this, ev.rawValue),
		});
	}
}
