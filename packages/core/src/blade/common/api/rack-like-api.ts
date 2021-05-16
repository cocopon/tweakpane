import {View} from '../../../common/view/view';
import {RackApi} from '../../rack/api/rack';
import {BladeController} from '../controller/blade';
import {BladeApi} from './blade';

/**
 * @hidden
 */
export class RackLikeApi<C extends BladeController<View>> extends BladeApi<C> {
	/**
	 * @hidden
	 */
	protected readonly rackApi_: RackApi;

	constructor(controller: C, rackApi: RackApi) {
		super(controller);
		this.rackApi_ = rackApi;
	}
}
