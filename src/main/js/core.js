const PropertyViewFactoryComplex = require('./factory/property_view_factory_complex');
const Appearance                 = require('./misc/appearance');
const ClassName                  = require('./misc/class_name');
const Errors                     = require('./misc/errors');
const EventEmitter               = require('./misc/event_emitter');
const ViewUtil                   = require('./misc/view_util');
const Property                   = require('./model/property');
const PropertyView               = require('./view/property_view');
const RootView                   = require('./view/root_view');

const RootFolderView = require('./view/root_folder_view');

class Core {
	constructor(opt_options) {
		this.rootView_ = new RootView();

		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		const containerElem = (options.container !== undefined) ?
			options.container :
			this.createDefaultContainer_();
		if (containerElem) {
			containerElem.appendChild(this.rootView_.getElement());
		}

		this.emitter_ = new EventEmitter();

		Appearance.inject();

		this.rootView_.getFooterView().addSubview(
			new RootFolderView()
		);
	}

	createDefaultContainer_() {
		const containerElem = document.createElement('div');
		containerElem.classList.add(ClassName.get('DefaultContainer'));
		document.body.appendChild(containerElem);
		return containerElem;
	}

	getRootView() {
		return this.rootView_;
	}

	getEmitter() {
		return this.emitter_;
	}

	addProperty(target, propName, options) {
		const propView = PropertyViewFactoryComplex.create(
			target, propName, options
		);

		this.rootView_.getMainView().addSubview(propView);

		const prop = propView.getProperty();
		prop.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onPropertyChange_,
			this
		);

		return propView;
	}

	getProperties_() {
		const views = ViewUtil.getAllSubviews(this.rootView_);
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

	refreshProperties() {
		this.getProperties_().forEach((prop) => {
			prop.applySourceValue();
		});
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

	onPropertyChange_(prop) {
		this.emitter_.notifyObservers(
			Core.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}
}

Core.EVENT_CHANGE = 'change';

module.exports = Core;
