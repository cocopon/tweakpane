import {Constants} from '../../misc/constants';
import {IntervalTicker} from '../../misc/ticker/interval';
import {ManualTicker} from '../../misc/ticker/manual';
import {Ticker} from '../../misc/ticker/ticker';
import {TypeUtil} from '../../misc/type-util';

export function createTicker(
	document: Document,
	interval: number | undefined,
): Ticker {
	return interval === 0
		? new ManualTicker()
		: new IntervalTicker(
				document,
				TypeUtil.getOrDefault<number>(
					interval,
					Constants.monitor.defaultInterval,
				),
		  );
}
