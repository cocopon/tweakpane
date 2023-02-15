import {PluginPool} from '../../../plugin/pool';
import {ContainerBladeController} from '../controller/container-blade';
import {BladeApi} from './blade';
import {RackApi} from './rack';

/**
 * @hidden
 */
export class ContainerBladeApi<
	C extends ContainerBladeController,
> extends BladeApi<C> {
	/**
	 * @hidden
	 */
	protected readonly rackApi_: RackApi;

	constructor(controller: C, pool: PluginPool) {
		super(controller);

		this.rackApi_ = new RackApi(controller.rackController, pool);
	}
}

export function isContainerBladeApi(
	api: BladeApi,
): api is ContainerBladeApi<ContainerBladeController> {
	return 'rackApi_' in api;
}
