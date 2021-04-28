import {Controller} from '../common/controller/controller';
import {ValueMap} from '../common/model/value-map';
import {ViewProps} from '../common/model/view-props';
import {PlainView} from '../common/view/plain';
import {BladeController} from './common/controller/blade';
import {createBlade} from './common/model/blade';
import {LabelController} from './label/controller/label';
import {LabelPropsObject} from './label/view/label';

class LabelableController implements Controller {
	public readonly viewProps = ViewProps.create();
	public readonly view: PlainView;

	constructor(doc: Document) {
		this.view = new PlainView(doc, {
			viewName: '',
			viewProps: this.viewProps,
		});
	}
}

export function createEmptyLabelableController(doc: Document) {
	return new LabelableController(doc);
}

export function createLabelController(doc: Document, vc: LabelableController) {
	return new LabelController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({label: ''}),
		valueController: vc,
	});
}

export function createEmptyBladeController(
	doc: Document,
): BladeController<PlainView> {
	return new BladeController({
		blade: createBlade(),
		view: new PlainView(doc, {
			viewName: '',
			viewProps: ViewProps.create(),
		}),
		viewProps: ViewProps.create(),
	});
}
