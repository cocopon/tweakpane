const ClassName      = require('../misc/class_name');
const ComponentUtil  = require('../misc/component_util');
const Errors         = require('../misc/errors');
const EventEmitter   = require('../misc/event_emitter');
const Reference      = require('../misc/reference');
const Style          = require('../misc/style');
const ViewUtil       = require('../misc/view_util');
const Model          = require('../model/model');
const PropertyView   = require('../view/property_view');
const RootFolderView = require('../view/root_folder_view');
const View           = require('../view/view');
const ViewInterface  = require('./view_interface');

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

		Style.injectDefault();

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

	// Controls

	addControl(target, propertyName, opt_options) {
		return ComponentUtil.addControl(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addText(target, propertyName, opt_options) {
		return ComponentUtil.addText(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addSlider(target, propertyName, opt_options) {
		return ComponentUtil.addSlider(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addSelector(target, propertyName, opt_options) {
		return ComponentUtil.addSelector(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addCheckbox(target, propertyName, opt_options) {
		return ComponentUtil.addCheckbox(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addPalette(target, propertyName, opt_options) {
		return ComponentUtil.addPalette(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	// Monitors

	addMonitor(target, propertyName, opt_options) {
		return ComponentUtil.addMonitor(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addLogger(target, propertyName, opt_options) {
		return ComponentUtil.addLogger(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	addGraph(target, propertyName, opt_options) {
		return ComponentUtil.addGraph(
			this.view_.getMainView(),
			new Reference(target, propertyName),
			opt_options
		);
	}

	// Other Components

	addFolder(title) {
		const fvInterface = ComponentUtil.addFolder(
			this.view_.getMainView(),
			title
		);
		const folderView = fvInterface.getView();
		folderView.getEmitter().on(
			View.EVENT_ADD,
			this.onViewAdd_,
			this
		);

		return fvInterface;
	}

	addButton(title) {
		return ComponentUtil.addButton(
			this.view_.getMainView(),
			title
		);
	}

	addSeparator() {
		return ComponentUtil.addSeparator(
			this.view_.getMainView()
		);
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

module.exports = RootViewInterface;
