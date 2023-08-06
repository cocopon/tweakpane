import {BladeApi} from '../blade/common/api/blade.js';
import {BladeController} from '../blade/common/controller/blade.js';

/**
 * A cache that maps blade controllers and APIs.
 * @hidden
 */
export class BladeApiCache {
	private map_: Map<BladeController, BladeApi> = new Map();

	public get(bc: BladeController): BladeApi | null {
		return this.map_.get(bc) ?? null;
	}

	public has(bc: BladeController): boolean {
		return this.map_.has(bc);
	}

	public add(bc: BladeController, api: BladeApi): typeof api {
		this.map_.set(bc, api);
		bc.viewProps.handleDispose(() => {
			this.map_.delete(bc);
		});
		return api;
	}
}
