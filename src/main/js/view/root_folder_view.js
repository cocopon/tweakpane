import ClassName from '../misc/class_name';
import Style     from '../misc/style';
import RootView  from './root_view';
import View      from './view';

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

	applyExpanded_(opt_animated) {
		const animated = (opt_animated !== undefined) ?
			opt_animated :
			true;

		Style.runTransition(this.arrowElem_, (arrowElem) => {
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
		}, animated);

		const rootView = this.findRootView_();
		if (rootView !== null) {
			const mainViewElem = rootView.getMainView().getElement();
			const contentHeight = this.getContentHeightOfMainView_();
			const mainViewHeight = this.expanded_ ? contentHeight : 0;

			Style.runTransition(mainViewElem, () => {
				mainViewElem.style.height = `${contentHeight - mainViewHeight}px`;
			}, false);

			Style.runTransition(mainViewElem, () => {
				mainViewElem.style.height = `${mainViewHeight}px`;
			}, animated);

			if (this.timer_ !== null) {
				clearTimeout(this.timer_);
			}

			if (this.expanded_) {
				const duration = Style.getMaxTransitionDuration(mainViewElem, 'height');
				this.timer_ = setTimeout(() => {
					this.timer_ = null;

					Style.runTransition(mainViewElem, () => {
						mainViewElem.style.height = 'auto';
					}, false);
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
