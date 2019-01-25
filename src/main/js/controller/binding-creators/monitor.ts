import PaneError from '../../misc/pane-error';
import Target from '../../model/target';
import * as BooleanMonitorBindingControllerCreators from './boolean-monitor';
import * as NumberMonitorBindingControllerCreators from './number-monitor';
import * as StringMonitorBindingControllerCreators from './string-monitor';

interface Params {
	count?: number;
	interval?: number;
	label?: string;
	max?: number;
	min?: number;
	multiline?: boolean;
	type?: string;
}

export type MonitorableType = boolean | number | string;

/**
 * @hidden
 */
export function create(document: Document, target: Target, params: Params) {
	const initialValue = target.read();

	if (initialValue === null || initialValue === undefined) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	if (typeof initialValue === 'number') {
		if (params.type === 'graph') {
			return NumberMonitorBindingControllerCreators.createGraphMonitor(
				document,
				target,
				params,
			);
		}
		return NumberMonitorBindingControllerCreators.createTextMonitor(
			document,
			target,
			params,
		);
	}
	if (typeof initialValue === 'string') {
		return StringMonitorBindingControllerCreators.createTextMonitor(
			document,
			target,
			params,
		);
	}
	if (typeof initialValue === 'boolean') {
		return BooleanMonitorBindingControllerCreators.createTextMonitor(
			document,
			target,
			params,
		);
	}

	throw new PaneError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
