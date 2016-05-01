const ClassName = require('../misc/class_name');
const RootView  = require('./root_view');
const View      = require('./view');

class RootFolderView extends View {
	constructor() {
		super();

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(RootFolderView.BLOCK_CLASS)
		);

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(
			ClassName.get(RootFolderView.BLOCK_CLASS, 'button')
		);
		buttonElem.addEventListener(
			'click',
			this.onButtonElementClick_.bind(this)
		);
		elem.appendChild(buttonElem);

		const arrowElem = document.createElement('span');
		arrowElem.classList.add(
			ClassName.get(RootFolderView.BLOCK_CLASS, 'arrow')
		);
		buttonElem.appendChild(arrowElem);
		this.arrowElem_ = arrowElem;

		this.timer_ = null;

		this.setExpanded(true, false);
	}

	findRootView_() {
		let view = this;
		while (view !== null) {
			if (view instanceof RootView) {
				return view;
			}

			view = view.getParentView();
		}
		return null;
	}

	isExpanded() {
		return this.expanded_;
	}

	setExpanded(expanded, opt_animated) {
		this.expanded_ = expanded;
		this.applyExpanded_(opt_animated);
	}

	applyExpandingAnimationEnabled_(enabled) {
		let className = ClassName.get(
			RootFolderView.BLOCK_CLASS, null, 'animated'
		);

		if (enabled) {
			this.elem_.classList.add(className);
		}
		else {
			this.elem_.classList.remove(className);
		}
	}

	applyExpanded_(opt_animated) {
		const animated = (opt_animated !== undefined) ?
			opt_animated :
			true;
		this.applyExpandingAnimationEnabled_(animated);

		const arrowClass = ClassName.get(
			RootFolderView.BLOCK_CLASS,
			'arrow',
			'expanded'
		);
		if (this.expanded_) {
			this.arrowElem_.classList.add(arrowClass);
		}
		else {
			this.arrowElem_.classList.remove(arrowClass);
		}

		const rootView = this.findRootView_();
		if (rootView === null) {
			return;
		}
		const mainView = rootView.getMainView();
		const mainViewHeight = this.expanded_ ?
			this.getMainViewHeight_() :
			0;
		mainView.getElement().style.height = `${mainViewHeight}px`;

		if (this.timer_ !== null) {
			clearTimeout(this.timer_);
		}

		if (this.expanded_) {
			this.timer_ = setTimeout(() => {
				mainView.getElement().style.height = 'auto';
				this.timer_ = null;
			}, 200);
		}
	}

	getMainViewHeight_() {
		const rootView = this.findRootView_();
		if (rootView === null) {
			return 0;
		}

		const mainView = rootView.getMainView();
		return mainView.getSubviews().reduce((total, subview) => {
			return total + subview.getElement().offsetHeight;
		}, 0);
	}

	onButtonElementClick_() {
		this.setExpanded(!this.isExpanded());
	}
}

RootFolderView.BLOCK_CLASS = 'rfv';

module.exports = RootFolderView;
