import ClassName      from '../misc/class_name';
import ComponentUtil  from '../misc/component_util';
import Errors         from '../misc/errors';
import EventEmitter   from '../misc/event_emitter';
import Reference      from '../misc/reference';
import ViewUtil       from '../misc/view_util';
import Model          from '../model/model';
import PropertyView   from '../view/property_view';
import RootFolderView from '../view/root_folder_view';
import View           from '../view/view';
import ViewInterface  from './view_interface';

class RootViewInterface extends ViewInterface {
	constructor(view, opt_options) {
		super(view);

		const mainView = this.view_.getMainView();
		mainView.getEmitter().on(
			View.EVENT_ADD,
			this.onViewAdd_,
			this
		);

		this.propListeners_ = [];

		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		const containerElem = (options.container !== undefined) ?
			options.container :
			this.createDefaultContainer_();
		if (containerElem) {
			containerElem.appendChild(this.view_.getElement());
		}

		this.emitter_ = new EventEmitter();

		const foldable = (options.foldable !== undefined) ?
			options.foldable :
			true;
		if (foldable) {
			this.view_.getFooterView().addSubview(
				new RootFolderView()
			);
		}
	}

	createDefaultContainer_() {
		const containerElem = document.createElement('div');
		containerElem.classList.add(ClassName.get('DefaultContainer'));
		document.body.appendChild(containerElem);
		return containerElem;
	}

	getElement() {
		return this.view_.getElement();
	}

	addProerty_(propertyViewInterface) {
		this.view_.getMainView().addSubview(
			propertyViewInterface.getView()
		);
		return propertyViewInterface;
	}

	// Controls

	addControl(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createControl(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addText(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createText(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addSlider(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createSlider(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addSelector(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createSelector(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addCheckbox(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createCheckbox(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addPalette(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createPalette(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	// Monitors

	addMonitor(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createMonitor(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addColorMonitor(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createColorMonitor(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addLogger(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createLogger(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addGraph(target, propertyName, opt_options) {
		return this.addProerty_(
			ComponentUtil.createGraph(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	// Other Components

	addFolder(title) {
		const intf = ComponentUtil.createFolder(title);
		const folderView = intf.getView();
		folderView.getEmitter().on(
			View.EVENT_ADD,
			this.onViewAdd_,
			this
		);
		this.view_.getMainView().addSubview(folderView);
		return intf;
	}

	addButton(title) {
		const intf = ComponentUtil.createButton(title);
		const buttonView = intf.getView();
		this.view_.getMainView().addSubview(buttonView);
		return intf;
	}

	addSeparator() {
		const intf = ComponentUtil.createSeparator();
		const separatorView = intf.getView();
		this.view_.getMainView().addSubview(separatorView);
		return intf;
	}

	// Import/Export

	getProperties_() {
		const views = ViewUtil.getAllSubviews(this.view_);
		const propViews = views.filter((view) => {
			return view instanceof PropertyView;
		});
		return propViews.map((propView) => {
			return propView.getProperty();
		});
	}

	getPropertiesForJson_() {
		const props = this.getProperties_().filter((prop) => {
			return !prop.isForMonitor();
		});
		const result = {};
		props.forEach((prop) => {
			const propId = prop.getId();
			if (result[propId] !== undefined) {
				throw Errors.duplicatedPropertyId(propId);
			}
			result[propId] = prop;
		});
		return result;
	}

	getJson() {
		const props = this.getPropertiesForJson_();
		return Object.keys(props).reduce((result, propId) => {
			const prop = props[propId];
			result[propId] = prop.getValue();
			return result;
		}, {});
	}

	setJson(json) {
		const props = this.getPropertiesForJson_();
		Object.keys(json).forEach((propId) => {
			const prop = props[propId];
			if (prop === undefined) {
				return;
			}

			prop.setValue(json[propId]);
		});
	}

	// Events

	on(eventName, handler, opt_scope) {
		this.emitter_.on(eventName, handler, opt_scope);
		return this;
	}

	off(eventName, handler, opt_scope) {
		this.emitter_.off(eventName, handler, opt_scope);
		return this;
	}

	// Misc

	refresh() {
		this.getProperties_().forEach((prop) => {
			prop.applySourceValue();
		});
	}

	handleProperty_(prop) {
		prop.getModel().getEmitter().on(
			Model.EVENT_CHANGE,
			() => {
				this.onPropertyModelChange_(prop);
			},
			this
		);
	}

	onViewAdd_(subview) {
		if (subview instanceof PropertyView) {
			this.handleProperty_(subview.getProperty());
		}
	}

	onPropertyModelChange_(prop) {
		this.emitter_.notifyObservers(
			RootViewInterface.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}
}

RootViewInterface.EVENT_CHANGE = 'change';

export default RootViewInterface;
