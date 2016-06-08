const PropertyViewFactoryComplex = require('./factory/property_view_factory_complex');
const ClassName                  = require('./misc/class_name');
const Errors                     = require('./misc/errors');
const EventEmitter               = require('./misc/event_emitter');
const Style                      = require('./misc/style');
const ViewUtil                   = require('./misc/view_util');
const Model                      = require('./model/model');
const PropertyView               = require('./view/property_view');
const RootFolderView             = require('./view/root_folder_view');
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

		Style.injectDefault();

		const foldable = (options.foldable !== undefined) ?
			options.foldable :
			true;
		if (foldable) {
			this.rootView_.getFooterView().addSubview(
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
		const model = prop.getModel();
		model.getEmitter().on(
			Model.EVENT_CHANGE,
			() => {
				this.onPropertyModelChange_(prop);
			},
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

	onPropertyModelChange_(prop) {
		this.emitter_.notifyObservers(
			Core.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}
}

Core.EVENT_CHANGE = 'change';

module.exports = Core;
