import * as Style from '../sass/bundle.scss';
import {TweakpaneConfig} from './tweakpane-config';
import TweakpaneWithoutStyle from './tweakpane-without-style';

function embedDefaultStyleIfNeeded(document: Document) {
	const MARKER = 'tweakpane';
	if (document.querySelector(`style[data-for=${MARKER}]`)) {
		return;
	}

	const styleElem = document.createElement('style');
	styleElem.dataset.for = MARKER;
	styleElem.textContent = Style.toString();
	if (document.head) {
		document.head.appendChild(styleElem);
	}
}

export default class Tweakpane extends TweakpaneWithoutStyle {
	constructor(opt_config?: TweakpaneConfig) {
		super(opt_config);
		embedDefaultStyleIfNeeded(this.document);
	}
}
