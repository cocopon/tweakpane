const Style     = require('../misc/style');
const ClassName = require('../misc/class_name');
const View      = require('./view');

class FolderView extends View {
	constructor(title) {
		super();

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS)
		);

		const arrowElem = document.createElement('div');
		arrowElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'arrow')
		);
		elem.appendChild(arrowElem);
		this.arrowElem_ = arrowElem;

		const titleElem = document.createElement('div');
		titleElem.textContent = title;
		titleElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'title')
		);
		titleElem.addEventListener(
			'click',
			this.onTitleElementClick_.bind(this)
		);
		elem.appendChild(titleElem);

		const containerElem = document.createElement('div');
		containerElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'container')
		);
		elem.appendChild(containerElem);
		this.containerElem_ = containerElem;

		this.setExpanded(true, false);
	}

	getContainerElement_() {
		return this.containerElem_;
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
					FolderView.BLOCK_CLASS,
					'arrow',
					'expanded'
				);
				if (this.expanded_) {
					arrowElem.classList.add(arrowClass);
				}
				else {
					arrowElem.classList.remove(arrowClass);
				}
			}
		]);

		Style.runSeparately(this.containerElem_, [
			(containerElem) => {
				Style.setTransitionEnabled(containerElem, animated);
			},
			(containerElem) => {
				const contentHeight = this.expanded_ ?
					this.getContentHeight_() :
					0;
				containerElem.style.height = `${contentHeight}px`;
			}
		]);
	}

	getContentHeight_() {
		return this.subviews_.reduce((total, subview) => {
			return total + subview.getElement().offsetHeight;
		}, 0);
	}

	addSubview(subview) {
		super.addSubview(subview);
		this.applyExpanded_(false);
	}

	onTitleElementClick_() {
		this.setExpanded(!this.isExpanded());
	}
}

FolderView.BLOCK_CLASS = 'flv';

module.exports = FolderView;
