// @flow

import SeparatorView from '../view/separator';

export default class SeparatorController {
	+view: SeparatorView;

	constructor(document: Document) {
		this.view = new SeparatorView(document);
	}
}
