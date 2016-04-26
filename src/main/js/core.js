const PropertyViewFactoryComplex = require('./factory/property_view_factory_complex');
const Appearance   = require('./misc/appearance');
const ClassName    = require('./misc/class_name');
const Errors       = require('./misc/errors');
const EventEmitter = require('./misc/event_emitter');
const ViewUtil     = require('./misc/view_util');
const Property     = require('./model/property');
const Monitor      = require('./view/monitor/monitor');
const FolderView   = require('./view/folder_view');
const PropertyView = require('./view/property_view');
const RootView     = require('./view/root_view');

class Core {
	constructor(opt_options) {
		this.rootView_ = new RootView();

		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		const autoPlace = (options.autoPlace !== undefined) ?
			options.autoPlace :
			true;
		if (autoPlace) {
			const containerElem = document.createElement('div');
			containerElem.classList.add(ClassName.get('DefaultContainer'));
			containerElem.appendChild(this.rootView_.getElement());
			document.body.appendChild(containerElem);
		}

		this.emitter_ = new EventEmitter();

		Appearance.apply();

		this.monitoringProps_ = [];
		this.monitoringTimer_ = null;
		this.startMonitoring_();
	}

	getRootView() {
		return this.rootView_;
	}

	getEmitter() {
		return this.emitter_;
	}

	addProperty(target, propName, monitor, opt_options) {
		const propView = PropertyViewFactoryComplex.create(target, propName, monitor, opt_options);

		this.rootView_.addSubview(propView);

		const prop = propView.getProperty();
		prop.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onPropertyChange_,
			this
		);

		if (monitor) {
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
		}

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

	startMonitoring_() {
		if (this.monitoringTimer_ !== null) {
			return;
		}

		this.monitoringTimer_ = setInterval(
			this.onMonitoringTimerTick_.bind(this),
			1000 / 30
		);
	}

	onPropertyChange_(prop) {
		this.emitter_.notifyObservers(
			Core.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}

	onMonitoringTimerTick_() {
		this.monitoringProps_.forEach((prop) => {
			prop.applySourceValue();
		});
	}
}

Core.EVENT_CHANGE = 'change';

module.exports = Core;
