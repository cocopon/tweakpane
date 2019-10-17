import PaneError from '../../misc/pane-error';
import Target from '../../model/target';
import {MonitorParams} from '../ui';
import * as BooleanMonitorBindingControllerCreators from './boolean-monitor';
import * as NumberMonitorBindingControllerCreators from './number-monitor';
import * as StringMonitorBindingControllerCreators from './string-monitor';

export type MonitorableType = boolean | number | string;

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: MonitorParams,
) {
	const initialValue = target.read();

	if (initialValue === null || initialValue === undefined) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	{
		const mbc = NumberMonitorBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (mbc) {
			return mbc;
		}
	}
	{
		const mbc = StringMonitorBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (mbc) {
			return mbc;
		}
	}
	{
		const mbc = BooleanMonitorBindingControllerCreators.create(
			document,
			target,
			params,
		);
		if (mbc) {
			return mbc;
		}
	}

	throw new PaneError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
