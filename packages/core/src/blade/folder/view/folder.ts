import {bindValueMap} from '../../../common/model/reactive.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {
	bindValueToTextContent,
	valueToClassName,
} from '../../../common/view/reactive.js';
import {View} from '../../../common/view/view.js';
import {isEmpty} from '../../../misc/type-util.js';
import {Foldable} from '../../common/model/foldable.js';
import {bladeContainerClassName} from '../../common/view/blade-container.js';

/**
 * @hidden
 */
export type FolderPropsObject = {
	title: string | undefined;
};

/**
 * @hidden
 */
export type FolderProps = ValueMap<FolderPropsObject>;

/**
 * @hidden
 */
interface Config {
	foldable: Foldable;
	props: FolderProps;
	viewProps: ViewProps;

	viewName?: string;
}

/**
 * @hidden
 */
export class FolderView implements View {
	public readonly buttonElement: HTMLButtonElement;
	public readonly containerElement: HTMLElement;
	public readonly titleElement: HTMLElement;
	public readonly element: HTMLElement;
	private readonly foldable_: Foldable;
	private readonly className_: ReturnType<typeof ClassName>;

	constructor(doc: Document, config: Config) {
		this.className_ = ClassName(config.viewName ?? 'fld');
		this.element = doc.createElement('div');
		this.element.classList.add(this.className_(), bladeContainerClassName());
		config.viewProps.bindClassModifiers(this.element);

		this.foldable_ = config.foldable;
		this.foldable_.bindExpandedClass(
			this.element,
			this.className_(undefined, 'expanded'),
		);
		bindValueMap(
			this.foldable_,
			'completed',
			valueToClassName(this.element, this.className_(undefined, 'cpl')),
		);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(this.className_('b'));
		bindValueMap(config.props, 'title', (title) => {
			if (isEmpty(title)) {
				this.element.classList.add(this.className_(undefined, 'not'));
			} else {
				this.element.classList.remove(this.className_(undefined, 'not'));
			}
		});
		config.viewProps.bindDisabled(buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const indentElem = doc.createElement('div');
		indentElem.classList.add(this.className_('i'));
		this.element.appendChild(indentElem);

		const titleElem = doc.createElement('div');
		titleElem.classList.add(this.className_('t'));
		bindValueToTextContent(config.props.value('title'), titleElem);
		this.buttonElement.appendChild(titleElem);
		this.titleElement = titleElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(this.className_('m'));
		this.buttonElement.appendChild(markElem);

		const containerElem = doc.createElement('div');
		containerElem.classList.add(this.className_('c'));
		this.element.appendChild(containerElem);
		this.containerElement = containerElem;
	}
}
