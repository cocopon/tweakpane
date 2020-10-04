import {Constants} from '../../misc/constants';
import {IntervalTicker} from '../../misc/ticker/interval';
import {Ticker} from '../../misc/ticker/ticker';
import {TypeUtil} from '../../misc/type-util';

export function createTicker(
	document: Document,
	interval: number | undefined,
): Ticker {
	const ticker = new IntervalTicker(
		document,
		TypeUtil.getOrDefault<number>(interval, Constants.monitorDefaultInterval),
	);
	return ticker;
}
