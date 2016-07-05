import Style     from '../misc/style';
import ClassName from '../misc/class_name';
import Folder    from '../model/folder';
import Model     from '../model/model';
import View      from './view';

class FolderView extends View {
	constructor(title) {
		super();

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS)
		);

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'button')
		);
		buttonElem.addEventListener(
			'click',
			this.onButtonElementClick_.bind(this)
		);
		elem.appendChild(buttonElem);

		const arrowElem = document.createElement('span');
		arrowElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'arrow')
		);
		buttonElem.appendChild(arrowElem);
		this.arrowElem_ = arrowElem;

		const titleElem = document.createElement('span');
		titleElem.textContent = title;
		titleElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'title')
		);
		buttonElem.appendChild(titleElem);

		const containerElem = document.createElement('div');
		containerElem.classList.add(
			ClassName.get(FolderView.BLOCK_CLASS, 'container')
		);
		elem.appendChild(containerElem);
		this.containerElem_ = containerElem;

		const folder = new Folder();
		folder.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onFolderChange_,
			this
		);
		this.folder_ = folder;
		this.folder_.setExpanded(true, false);
	}

	getContainerElement_() {
		return this.containerElem_;
	}

	getFolder() {
		return this.folder_;
	}

	getContentHeight_() {
		return this.subviews_.reduce((total, subview) => {
			return total + subview.getElement().offsetHeight;
		}, 0);
	}

	applyExpanded_() {
		const folder = this.folder_;

		Style.runTransition(this.arrowElem_, (arrowElem) => {
			const arrowClass = ClassName.get(
				FolderView.BLOCK_CLASS,
				'arrow',
				'expanded'
			);
			if (folder.isExpanded()) {
				arrowElem.classList.add(arrowClass);
			}
			else {
				arrowElem.classList.remove(arrowClass);
			}
		}, folder.shouldAnimate());

		Style.runTransition(this.containerElem_, (containerElem) => {
			const contentHeight = folder.isExpanded() ?
				this.getContentHeight_() :
				0;
			containerElem.style.height = `${contentHeight}px`;
		}, folder.shouldAnimate());
	}

	addSubview(subview) {
		super.addSubview(subview);
		this.applyExpanded_();
	}

	onButtonElementClick_() {
		this.folder_.setExpanded(
			!this.folder_.isExpanded(),
			true
		);
	}

	onFolderChange_() {
		this.applyExpanded_();
	}
}

FolderView.BLOCK_CLASS = 'flv';

module.exports = FolderView;
