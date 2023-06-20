import {ButtonBladePlugin} from '../blade/button/plugin.js';
import {FolderBladePlugin} from '../blade/folder/plugin.js';
import {BladePlugin} from '../blade/plugin.js';
import {TabBladePlugin} from '../blade/tab/plugin.js';
import {BooleanInputPlugin} from '../input-binding/boolean/plugin.js';
import {NumberColorInputPlugin} from '../input-binding/color/plugin-number.js';
import {ObjectColorInputPlugin} from '../input-binding/color/plugin-object.js';
import {StringColorInputPlugin} from '../input-binding/color/plugin-string.js';
import {NumberInputPlugin} from '../input-binding/number/plugin.js';
import {InputBindingPlugin} from '../input-binding/plugin.js';
import {Point2dInputPlugin} from '../input-binding/point-2d/plugin.js';
import {Point3dInputPlugin} from '../input-binding/point-3d/plugin.js';
import {Point4dInputPlugin} from '../input-binding/point-4d/plugin.js';
import {StringInputPlugin} from '../input-binding/string/plugin.js';
import {BooleanMonitorPlugin} from '../monitor-binding/boolean/plugin.js';
import {NumberMonitorPlugin} from '../monitor-binding/number/plugin.js';
import {MonitorBindingPlugin} from '../monitor-binding/plugin.js';
import {StringMonitorPlugin} from '../monitor-binding/string/plugin.js';
import {BladeApiCache} from './blade-api-cache.js';
import {PluginPool} from './pool.js';

export type TpPlugin =
	| BladePlugin<any>
	| InputBindingPlugin<any, any, any>
	| MonitorBindingPlugin<any, any>;

export type TpPluginBundle =
	| {
			/**
			 * The custom CSS for the bundle.
			 */
			css?: string;

			/**
			 * The identifier of the bundle.
			 */
			id: string;

			plugin: TpPlugin;
	  }
	| {
			/**
			 * The custom CSS for the bundle.
			 */
			css?: string;

			/**
			 * The identifier of the bundle.
			 */
			id: string;

			plugins: TpPlugin[];
	  };

// Shared API cache for the default pool allows blade flexibility between different panes.
const sharedCache = new BladeApiCache();

export function createDefaultPluginPool(): PluginPool {
	const pool = new PluginPool(sharedCache);
	[
		// Input
		Point2dInputPlugin,
		Point3dInputPlugin,
		Point4dInputPlugin,
		StringInputPlugin,
		NumberInputPlugin,
		StringColorInputPlugin,
		ObjectColorInputPlugin,
		NumberColorInputPlugin,
		BooleanInputPlugin,
		// Monitor
		BooleanMonitorPlugin,
		StringMonitorPlugin,
		NumberMonitorPlugin,
		// Blade
		ButtonBladePlugin,
		FolderBladePlugin,
		TabBladePlugin,
	].forEach((p) => {
		pool.register('core', p);
	});
	return pool;
}
