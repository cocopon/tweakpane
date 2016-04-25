const Appearance                 = require('./misc/appearance');
const ClassName                  = require('./misc/class_name');
const Errors                     = require('./misc/errors');
const EventEmitter               = require('./misc/event_emitter');
const PropertyControllerProvider = require('./misc/property_controller_provider');
const ViewUtil                   = require('./misc/view_util');
const Property                   = require('./model/property');
const FolderView                 = require('./view/folder_view');
const PropertyView               = require('./view/property_view');
const View                       = require('./view/view');

const FolderFluent = require('./fluent/folder_fluent');

class Seasoner {
	constructor(opt_options) {
		const rootView = new View();
		rootView.getElement().classList.add(ClassName.get(''));
		this.rootView_ = rootView;

		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		const autoPlace = (options.autoPlace !== undefined) ?
			options.autoPlace :
			true;
		if (autoPlace) {
			const containerElem = document.createElement('div');
			containerElem.classList.add(ClassName.get('DefaultContainer'));
			containerElem.appendChild(rootView.getElement());
			document.body.appendChild(containerElem);
		}

		this.emitter_ = new EventEmitter();

		Appearance.apply();
	}

	getElement() {
		return this.rootView_.getElement();
	}

	getEmitter() {
		return this.emitter_;
	}

	add(target, propName, options) {
		const propView = PropertyControllerProvider.provide(target, propName, options);

		this.rootView_.addSubview(propView);

		const prop = propView.getProperty();
		prop.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onPropertyChange_,
			this
		);
	}

	monitor() {
		// TODO: Implement
	}

	addFolder(title) {
		const folderView = new FolderView(title);
		this.rootView_.addSubview(folderView);
		return new FolderFluent(folderView);
	}

	on(eventName, handler, opt_scope) {
		this.emitter_.on(eventName, handler, opt_scope);
	}

	off(eventName, handler, opt_scope) {
		this.emitter_.off(eventName, handler, opt_scope);
	}

	getAllProperties_() {
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
		const props = this.getAllProperties_();
		return Object.keys(props).reduce((result, propId) => {
			result[propId] = props[propId].getModel().getValue();
			return result;
		}, {});
	}

	loadJson(json) {
		const props = this.getAllProperties_();
		Object.keys(json).forEach((propId) => {
			const prop = props[propId];
			if (prop === undefined) {
				return;
			}

			prop.getModel().setValue(json[propId]);
		});
	}

	onPropertyChange_(prop) {
		this.emitter_.notifyObservers(
			Seasoner.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}
}

Seasoner.EVENT_CHANGE = 'change';

window.Seasoner = Seasoner;
