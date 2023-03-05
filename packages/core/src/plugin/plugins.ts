import {ButtonBladePlugin} from '../blade/button/plugin';
import {FolderBladePlugin} from '../blade/folder/plugin';
import {BladePlugin} from '../blade/plugin';
import {TabBladePlugin} from '../blade/tab/plugin';
import {BooleanInputPlugin} from '../input-binding/boolean/plugin';
import {NumberColorInputPlugin} from '../input-binding/color/plugin-number';
import {ObjectColorInputPlugin} from '../input-binding/color/plugin-object';
import {StringColorInputPlugin} from '../input-binding/color/plugin-string';
import {NumberInputPlugin} from '../input-binding/number/plugin';
import {InputBindingPlugin} from '../input-binding/plugin';
import {Point2dInputPlugin} from '../input-binding/point-2d/plugin';
import {Point3dInputPlugin} from '../input-binding/point-3d/plugin';
import {Point4dInputPlugin} from '../input-binding/point-4d/plugin';
import {StringInputPlugin} from '../input-binding/string/plugin';
import {BooleanMonitorPlugin} from '../monitor-binding/boolean/plugin';
import {NumberMonitorPlugin} from '../monitor-binding/number/plugin';
import {MonitorBindingPlugin} from '../monitor-binding/plugin';
import {StringMonitorPlugin} from '../monitor-binding/string/plugin';
import {ApiCache} from './api-cache';
import {PluginPool} from './pool';

export type TpPlugin =
	| BladePlugin<any>
	| InputBindingPlugin<any, any, any>
	| MonitorBindingPlugin<any, any>;

export type TpPluginBundle =
	| {
			plugin: TpPlugin;
	  }
	| {
			plugins: TpPlugin[];
	  };

// Shared API cache for the default pool allows blade flexibility between different panes.
const sharedCache = new ApiCache();

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
		pool.register(p);
	});
	return pool;
}
