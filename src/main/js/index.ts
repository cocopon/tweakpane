import * as Style from '../sass/bundle.scss';
import {PlainTweakpane} from './plain-tweakpane';
import {TweakpaneConfig} from './tweakpane-config';

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

// tslint:disable-next-line: no-default-export
export default class Tweakpane extends PlainTweakpane {
	constructor(opt_config?: TweakpaneConfig) {
		super(opt_config);
		embedDefaultStyleIfNeeded(this.document);
	}
}
