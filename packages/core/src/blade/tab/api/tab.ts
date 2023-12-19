import {Emitter} from '../../../common/model/emitter.js';
import {ValueEvents} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {PluginPool} from '../../../plugin/pool.js';
import {BladeApi} from '../../common/api/blade.js';
import {ContainerBladeApi} from '../../common/api/container-blade.js';
import {EventListenable} from '../../common/api/event-listenable.js';
import {TpChangeEvent, TpTabSelectEvent} from '../../common/api/tp-event.js';
import {createBlade} from '../../common/model/blade.js';
import {TabController} from '../controller/tab.js';
import {TabPageController, TabPagePropsObject} from '../controller/tab-page.js';
import {TabItemPropsObject} from '../view/tab-item.js';
import {TabPageApi} from './tab-page.js';

interface TabApiEvents {
	change: TpChangeEvent<unknown, BladeApi>;
	select: TpTabSelectEvent<TabApi>;
}

export interface TabPageParams {
	title: string;

	index?: number;
}

export class TabApi
	extends ContainerBladeApi<TabController>
	implements EventListenable<TabApiEvents>
{
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

		this.controller.tab.selectedIndex.emitter.on('change', this.onSelect_);
	}

	get pages(): TabPageApi[] {
		return this.rackApi_.children as TabPageApi[];
	}

	public addPage(params: TabPageParams): TabPageApi {
		const doc = this.controller.view.element.ownerDocument;
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
		const papi = this.pool_.createApi(pc) as TabPageApi;
		return this.rackApi_.add(papi, params.index);
	}

	public removePage(index: number): void {
		this.rackApi_.remove(this.rackApi_.children[index]);
	}

	public on<EventName extends keyof TabApiEvents>(
		eventName: EventName,
		handler: (ev: TabApiEvents[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(
			eventName,
			(ev) => {
				bh(ev);
			},
			{
				key: handler,
			},
		);
		return this;
	}

	public off<EventName extends keyof TabApiEvents>(
		eventName: EventName,
		handler: (ev: TabApiEvents[EventName]) => void,
	): this {
		this.emitter_.off(eventName, handler);
		return this;
	}

	private onSelect_(ev: ValueEvents<number>['change']) {
		this.emitter_.emit('select', new TpTabSelectEvent(this, ev.rawValue));
	}
}
