const PropertyViewFactoryComplex = require('./factory/property_view_factory_complex');
const Appearance                 = require('./misc/appearance');
const ClassName                  = require('./misc/class_name');
const Errors                     = require('./misc/errors');
const EventEmitter               = require('./misc/event_emitter');
const ViewUtil                   = require('./misc/view_util');
const Property                   = require('./model/property');
const FolderView                 = require('./view/folder_view');
const PropertyView               = require('./view/property_view');
const RootView                   = require('./view/root_view');

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

		this.rootView_.addSubview(propView);

		const prop = propView.getProperty();
		prop.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onPropertyChange_,
			this
		);

		return propView;
	}

	addFolder(title) {
		const folderView = new FolderView(title);
		this.rootView_.addSubview(folderView);
		return folderView;
	}

	getPropertiesForJson_() {
		const views = ViewUtil.getAllSubviews(this.rootView_);
		const propViews = views.filter((view) => {
			return view instanceof PropertyView;
		});
		const props = propViews.map((propView) => {
			return propView.getProperty();
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

	onPropertyChange_(prop) {
		this.emitter_.notifyObservers(
			Core.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}
}

Core.EVENT_CHANGE = 'change';

module.exports = Core;
