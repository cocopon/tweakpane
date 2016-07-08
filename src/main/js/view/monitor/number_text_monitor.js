import NumberFormatter from '../../formatter/number_formatter';
import TextMonitor     from './text_monitor';

class NumberTextMonitor extends TextMonitor {
	constructor(model) {
		super(model);

		this.formatter_ = new NumberFormatter();
	}
}

export default NumberTextMonitor;
