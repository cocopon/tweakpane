const Errors       = require('../misc/errors');
const Model        = require('../model/model');
const Property     = require('../model/property');
const Control      = require('../view/control/control');
const PropertyView = require('../view/property_view');
const Controller   = require('./controller');

class PropertyController extends Controller {
	constructor(target, propName) {
		super();

		const model = this.instanciateModel_();
		model.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);
		this.prop_ = new Property(target, propName, model);

		this.view_ = new PropertyView(this.prop_);
	}

	instanciateModel_() {
		throw Errors.notImplemented('instanciateModel_');
	}

	getProperty() {
		return this.prop_;
	}

	attachControl_(control) {
		control.getEmitter().on(
			Control.EVENT_CHANGE,
			this.onControlChange_,
			this
		);
	}

	detachControl_(control) {
		control.getEmitter().off(
			Control.EVENT_CHANGE,
			this.onControlChange_,
			this
		);
	}

	setControl_(control) {
		const view = this.getView();
		const prevControl = view.getControl();
		if (prevControl !== null) {
			this.detachControl_(prevControl);
		}

		view.setControl(control);

		this.attachControl_(control);
	}

	startMonitoring(opt_interval) {
		const interval = (opt_interval !== undefined) ?
			opt_interval :
			1000 / 30;
		setInterval(() => {
			this.getProperty().applySourceValue();
		}, interval);

		this.getProperty().setDisabled(true);
	}

	applyModel_() {
	}

	onModelChange_() {
		this.applyModel_();
	}

	onControlChange_(value) {
		this.prop_.getModel().setValue(value);
	}
}

module.exports = PropertyController;
