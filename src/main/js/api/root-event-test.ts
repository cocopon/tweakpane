import {describe, it} from 'mocha';

import {RootController} from '../controller/root';
import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		disposable: new Disposable(),
		title: 'Title',
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should listen fold event', (done) => {
		const api = createApi();
		api.on('fold', () => {
			done();
		});

		const folder = api.controller.folder;
		if (folder) {
			folder.expanded = false;
		}
	});
});
