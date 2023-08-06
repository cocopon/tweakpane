import {TpPluginBundle} from '@tweakpane/core';

import {CounterInputPlugin} from './plugin';

export const CounterPluginBundle: TpPluginBundle = {
	// Identifier of the plugin bundle
	id: 'counter',
	// Plugins that should be registered
	plugins: [CounterInputPlugin],

	// Additional CSS for this bundle
	css: `.tp-counter {
	align-items: center;
	display: flex;
}
.tp-counter div {
	color: #00ffd680;
	flex: 1;
}
.tp-counter button {
	background-color: #00ffd6c0;
	border-radius: 2px;
	color: black;
	height: 20px;
	width: 20px;
}`,
};
