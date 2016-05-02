const ClassName = require('../misc/class_name');
const Style     = require('../misc/style');
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

		this.expanded_ = true;
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

	applyExpanded_(opt_animated) {
		const animated = (opt_animated !== undefined) ?
			opt_animated :
			true;

		Style.runSeparately(this.arrowElem_, [
			(arrowElem) => {
				Style.setTransitionEnabled(arrowElem, animated);
			},
			(arrowElem) => {
				const arrowClass = ClassName.get(
					RootFolderView.BLOCK_CLASS,
					'arrow',
					'expanded'
				);
				if (this.expanded_) {
					arrowElem.classList.add(arrowClass);
				}
				else {
					arrowElem.classList.remove(arrowClass);
				}
			},
			(arrowElem) => {
				Style.setTransitionEnabled(arrowElem, true);
			}
		]);

		const rootView = this.findRootView_();
		if (rootView !== null) {
			const mainViewElem = rootView.getMainView().getElement();
			const contentHeight = this.getContentHeightOfMainView_();
			const mainViewHeight = this.expanded_ ? contentHeight : 0;

			Style.runSeparately(mainViewElem, [
				() => {
					Style.setTransitionEnabled(mainViewElem, false);
				},
				() => {
					mainViewElem.style.height = `${contentHeight - mainViewHeight}px`;
				},
				() => {
					Style.setTransitionEnabled(mainViewElem, animated);
				},
				() => {
					mainViewElem.style.height = `${mainViewHeight}px`;
				},
				() => {
					Style.setTransitionEnabled(mainViewElem, true);
				}
			]);

			if (this.timer_ !== null) {
				clearTimeout(this.timer_);
			}

			if (this.expanded_) {
				const duration = Style.getTransitionDuration(mainViewElem, 'height');
				this.timer_ = setTimeout(() => {
					// Set height to 'auto' at the end of transition for folding a folder
					mainViewElem.style.height = 'auto';
					this.timer_ = null;
				}, animated ? duration : 0);
			}
		}
	}

	getContentHeightOfMainView_() {
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
