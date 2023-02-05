import {PluginPool} from '../../../plugin/pool';
import {RackApi} from '../../rack/api/rack';
import {ContainerBladeController} from '../controller/container-blade';
import {BladeApi} from './blade';

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
