// @flow

import Style from '../sass/bundle.scss';
import RootApi from './api/root';
import RootController from './controller/root';
import ClassName from './misc/class-name';
import * as DomUtil from './misc/dom-util';
import FlowUtil from './misc/flow-util';

type Config = {
	container?: HTMLElement,
	document?: Document,
	title?: string,
};

function createDefaultWrapperElement(document: Document): HTMLElement {
	const elem = document.createElement('div');
	elem.classList.add(ClassName('dfw')());
	if (document.body) {
		document.body.appendChild(elem);
	}
	return elem;
}

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

export default class Tweakpane extends RootApi {
	constructor(opt_config?: Config) {
		const config = opt_config || {};
		const document = FlowUtil.getOrDefault(
			config.document,
			DomUtil.getWindowDocument(),
		);
		embedDefaultStyleIfNeeded(document);

		const rootController = new RootController(document, {
			title: config.title,
		});
		super(rootController);

		const containerElem = config.container ||
			createDefaultWrapperElement(document);
		containerElem.appendChild(this.element);
	}
}
