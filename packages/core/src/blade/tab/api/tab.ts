import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {PluginPool} from '../../../plugin/pool';
import {ContainerBladeApi} from '../../common/api/container-blade';
import {TpChangeEvent, TpTabSelectEvent} from '../../common/api/tp-event';
import {createBlade} from '../../common/model/blade';
import {TabController} from '../controller/tab';
import {TabPageController, TabPagePropsObject} from '../controller/tab-page';
import {TabItemPropsObject} from '../view/tab-item';
import {TabPageApi} from './tab-page';

interface TabApiEvents {
	change: TpChangeEvent<unknown>;
	select: TpTabSelectEvent;
}

export interface TabPageParams {
	title: string;

	index?: number;
}

export class TabApi extends ContainerBladeApi<TabController> {
	private readonly emitter_: Emitter<TabApiEvents> = new Emitter();
	private readonly pool_: PluginPool;

	/**
	 * @hidden
	 */
	constructor(controller: TabController, pool: PluginPool) {
		super(controller, pool);

		this.onSelect_ = this.onSelect_.bind(this);

		this.pool_ = pool;

		this.rackApi_.on('change', (ev) => {
			this.emitter_.emit('change', ev);
		});

		this.controller_.tab.selectedIndex.emitter.on('change', this.onSelect_);
	}

	get pages(): TabPageApi[] {
		return this.rackApi_.children as TabPageApi[];
	}

	public addPage(params: TabPageParams): TabPageApi {
		const doc = this.controller_.view.element.ownerDocument;
		const pc = new TabPageController(doc, {
			blade: createBlade(),
			itemProps: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: params.title,
			}),
			props: ValueMap.fromObject<TabPagePropsObject>({
				selected: false,
			}),
			viewProps: ViewProps.create(),
		});
		const papi = new TabPageApi(pc, this.pool_);
		return this.rackApi_.add(papi, params.index);
	}

	public removePage(index: number): void {
		this.rackApi_.remove(this.rackApi_.children[index]);
	}

	public on<EventName extends keyof TabApiEvents>(
		eventName: EventName,
		handler: (ev: TabApiEvents[EventName]) => void,
	): TabApi {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev);
		});
		return this;
	}

	private onSelect_(ev: ValueEvents<number>['change']) {
		this.emitter_.emit('select', new TpTabSelectEvent(this, ev.rawValue));
	}
}
