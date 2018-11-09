// @flow

import SeparatorView from '../view/separator';

export default class SeparatorController {
	view_: SeparatorView;

	constructor(document: Document) {
		this.view_ = new SeparatorView(document);
	}

	get view(): SeparatorView {
		return this.view_;
	}
}
