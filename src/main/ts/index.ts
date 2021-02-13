import {PlainTweakpane} from './pane/plain-tweakpane';
import {TweakpaneConfig} from './pane/tweakpane-config';

function embedDefaultStyleIfNeeded(document: Document) {
	const MARKER = 'tweakpane';
	if (document.querySelector(`style[data-for=${MARKER}]`)) {
		return;
	}

	const styleElem = document.createElement('style');
	styleElem.dataset.for = MARKER;
	styleElem.textContent = '__css__';
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
