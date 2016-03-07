const Appearance                 = require('./misc/appearance');
const ClassName                  = require('./misc/class_name');
const PropertyControllerProvider = require('./misc/property_controller_provider');
const FluentProvider             = require('./misc/fluent_provider');
const FolderFluent               = require('./fluent/folder_fluent');
const Controller                 = require('./controller/controller');
const FolderController           = require('./controller/folder_controller');
const PropertyController         = require('./controller/property_controller');

class Seasoner {
	constructor(opt_options) {
		const rootController = new Controller();
		const rootView = rootController.getView();
		rootView.addClass(ClassName.get(''));
		this.rootController_ = rootController;

		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		const autoPlace = (options.autoPlace !== undefined) ?
			options.autoPlace :
			true;
		if (autoPlace) {
			const containerElem = document.createElement('div');
			containerElem.className += ClassName.get('DefaultContainer');
			containerElem.appendChild(rootView.getElement());
			document.body.appendChild(containerElem);
		}

		Appearance.apply();
	}

	getElement() {
		return this.rootController_.getView().getElement();
	}

	add(target, propName) {
		const controller = PropertyControllerProvider.provide(target, propName);
		if (controller === null) {
			// TODO: Error
			return null;
		}

		this.rootController_.addSubcontroller(controller);
		return FluentProvider.provide(controller);
	}

	addFolder(title) {
		const controller = new FolderController();
		controller.getView().setTitle(title);
		this.rootController_.addSubcontroller(controller);
		return new FolderFluent(controller);
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
					// TODO: Found duplicated key
					throw new Error();
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
}

window.Seasoner = Seasoner;
