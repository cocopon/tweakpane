const ClassName      = require('../misc/class_name');
const ComponentUtil  = require('../misc/component_util');
const Errors         = require('../misc/errors');
const EventEmitter   = require('../misc/event_emitter');
const Style          = require('../misc/style');
const ViewUtil       = require('../misc/view_util');
const Model          = require('../model/model');
const PropertyView   = require('../view/property_view');
const RootFolderView = require('../view/root_folder_view');
const ViewInterface  = require('./view_interface');

class RootViewInterface extends ViewInterface {
	constructor(view, opt_options) {
		super(view);

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

	add(target, propName, opt_options) {
		const result = ComponentUtil.addProperty(
			this.view_.getMainView(),
			target,
			propName,
			opt_options
		);

		const prop = result.getView().getProperty();
		const model = prop.getModel();
		model.getEmitter().on(
			Model.EVENT_CHANGE,
			() => {
				this.onPropertyModelChange_(prop);
			},
			this
		);

		return result;
	}

	monitor(target, propName, opt_options) {
		const result = ComponentUtil.addMonitor(
			this.view_.getMainView(),
			target,
			propName,
			opt_options
		);

		const prop = result.getView().getProperty();
		const model = prop.getModel();
		model.getEmitter().on(
			Model.EVENT_CHANGE,
			() => {
				this.onPropertyModelChange_(prop);
			},
			this
		);

		return result;
	}

	refresh() {
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

	addFolder(title) {
		return ComponentUtil.addFolder(
			this.view_.getMainView(),
			title
		);
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

	on(eventName, handler, opt_scope) {
		this.emitter_.on(eventName, handler, opt_scope);
		return this;
	}

	off(eventName, handler, opt_scope) {
		this.emitter_.off(eventName, handler, opt_scope);
		return this;
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
