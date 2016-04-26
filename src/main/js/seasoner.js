const FolderViewInterface   = require('./interface/foloder_view_interface');
const PropertyViewInterface = require('./interface/property_view_interface');
const Appearance            = require('./misc/appearance');
const ClassName             = require('./misc/class_name');
const Errors                = require('./misc/errors');
const EventEmitter          = require('./misc/event_emitter');
const PropertyViewProvider  = require('./misc/property_view_provider');
const ViewUtil              = require('./misc/view_util');
const Property              = require('./model/property');
const Monitor               = require('./view/monitor/monitor');
const FolderView            = require('./view/folder_view');
const PropertyView          = require('./view/property_view');
const View                  = require('./view/view');

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

		this.monitoringProps_ = [];
		this.monitoringTimer_ = null;
		this.startMonitoring_();
	}

	getElement() {
		return this.rootView_.getElement();
	}

	getEmitter() {
		return this.emitter_;
	}

	addProperty_(target, propName, monitor, opt_options) {
		const propView = PropertyViewProvider.provide(target, propName, monitor, opt_options);

		this.rootView_.addSubview(propView);

		const prop = propView.getProperty();
		prop.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onPropertyChange_,
			this
		);

		return new PropertyViewInterface(propView);
	}

	add(target, propName, opt_options) {
		return this.addProperty_(target, propName, false, opt_options);
	}

	monitor(target, propName, opt_options) {
		const propInterface = this.addProperty_(target, propName, true, opt_options);

		// Update monitoring property list
		const views = ViewUtil.getAllSubviews(this.rootView_);
		this.monitoringProps_ = views.filter((view) => {
			if (!(view instanceof PropertyView)) {
				return false;
			}

			const hasMonitor = view.getSubviews().some((subview) => {
				return subview instanceof Monitor;
			});
			return hasMonitor;
		}).map((propView) => {
			return propView.getProperty();
		});

		return propInterface;
	}

	startMonitoring_() {
		if (this.monitoringTimer_ !== null) {
			return;
		}

		this.monitoringTimer_ = setInterval(
			this.onMonitoringTimerTick_.bind(this),
			1000 / 30
		);
	}

	onMonitoringTimerTick_() {
		this.monitoringProps_.forEach((prop) => {
			prop.applySourceValue();
		});
	}

	addFolder(title) {
		const folderView = new FolderView(title);
		this.rootView_.addSubview(folderView);
		return new FolderViewInterface(folderView);
	}

	on(eventName, handler, opt_scope) {
		this.emitter_.on(eventName, handler, opt_scope);
	}

	off(eventName, handler, opt_scope) {
		this.emitter_.off(eventName, handler, opt_scope);
	}

	getJsonProperties_() {
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
		const props = this.getJsonProperties_();
		return Object.keys(props).reduce((result, propId) => {
			result[propId] = props[propId].getModel().getValue();
			return result;
		}, {});
	}

	setJson(json) {
		const props = this.getJsonProperties_();
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
