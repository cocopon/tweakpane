import {BaseBladeParams} from '../../common/params';
import {TpError} from '../../common/tp-error';
import {BladePlugin} from '../plugin';
import {TabPageApi} from './api/tab-page';
import {TabPageController} from './controller/tab-page';

// The plugin only for creating TabPageApi with TabPageController
export const TabPageBladePlugin: BladePlugin<BaseBladeParams> = {
	id: 'tab-page',
	type: 'blade',
	accept(_params) {
		return null;
	},
	controller(_args) {
		throw TpError.shouldNeverHappen();
	},
	api(args) {
		if (!(args.controller instanceof TabPageController)) {
			return null;
		}
		return new TabPageApi(args.controller, args.pool);
	},
};
