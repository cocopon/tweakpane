const Appearance                 = require('./misc/appearance');
const ClassName                  = require('./misc/class_name');
const Errors                     = require('./misc/errors');
const EventEmitter               = require('./misc/event_emitter');
const PropertyControllerProvider = require('./misc/property_controller_provider');
const FluentProvider             = require('./misc/fluent_provider');
const Property                   = require('./model/property');
const FolderFluent               = require('./fluent/folder_fluent');
const Controller                 = require('./controller/controller');
const FolderController           = require('./controller/folder_controller');
const PropertyController         = require('./controller/property_controller');

class Seasoner {
	constructor(opt_options) {
		const rootController = new Controller();
		const rootView = rootController.getView();
		rootView.getElement().classList.add(ClassName.get(''));
		this.rootController_ = rootController;

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
		return this.rootController_.getView().getElement();
	}

	getEmitter() {
		return this.emitter_;
	}

	add(target, propName) {
		const controller = PropertyControllerProvider.provide(target, propName);

		this.rootController_.addSubcontroller(controller);

		const prop = controller.getProperty();
		prop.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onPropertyChange_,
			this
		);

		return FluentProvider.provide(controller);
	}

	addFolder(title) {
		const controller = new FolderController();
		controller.getView().setTitle(title);
		this.rootController_.addSubcontroller(controller);
		return new FolderFluent(controller);
	}

	on(eventName, handler, opt_scope) {
		this.emitter_.on(eventName, handler, opt_scope);
	}

	off(eventName, handler, opt_scope) {
		this.emitter_.off(eventName, handler, opt_scope);
	}

	getAllProperties_() {
		let cons = [this.rootController_];
		const result = {};

		while (cons.length > 0) {
			const con = cons.splice(0, 1)[0];

			if (con instanceof PropertyController) {
				const prop = con.getProperty();
				const propId = prop.getId();
				if (result[propId] !== undefined) {
					throw Errors.duplicatedPropertyId(propId);
				}
				result[propId] = prop;
			}

			cons = cons.concat(con.getSubcontrollers());
		}

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
