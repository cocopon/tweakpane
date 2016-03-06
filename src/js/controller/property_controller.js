const Model        = require('../model/model');
const Control      = require('../view/control/control');
const PropertyView = require('../view/property_view');
const Controller   = require('./controller');

class PropertyController extends Controller {
	constructor(target, propName) {
		super();

		this.target_ = target;
		this.propName_ = propName;
		this.id_ = propName;

		this.disabled_ = false;

		this.model_ = this.instanciateModel_();
		this.model_.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);

		this.view_.setLabel(this.propName_);
	}

	instanciateView_() {
		return new PropertyView();
	}

	instanciateModel_() {
		// TODO: Error
		throw new Error();
	}

	getTarget() {
		return this.target_;
	}

	getPropertyName() {
		return this.propName_;
	}

	getId() {
		return this.id_;
	}

	setId(id) {
		this.id_ = id;
	}

	getModel() {
		return this.model_;
	}

	isDisabled_() {
		return this.disabled_;
	}

	setDisabled_(disabled) {
		this.disabled_ = disabled;
		this.applyDisabled_();
	}

	applyDisabled_() {
		const control = this.getView().getControl();
		if (control === null) {
			return;
		}
		control.setDisabled(this.disabled_);
	}

	applySourceValue() {
		this.model_.setValue(this.target_[this.propName_]);
	}

	updateSourceValue() {
		this.target_[this.propName_] = this.model_.getValue();
	}

	setControl_(control) {
		const view = this.getView();
		const prevControl = view.getControl();
		if (prevControl !== null) {
			prevControl.getEmitter().off(
				Control.EVENT_CHANGE,
				this.onControlChange_,
				this
			);
		}

		view.setControl(control);

		control.getEmitter().on(
			Control.EVENT_CHANGE,
			this.onControlChange_,
			this
		);

		this.applyDisabled_();
	}

	startSync(opt_interval) {
		const interval = (opt_interval !== undefined) ?
			opt_interval :
			1000 / 30;
		setInterval(() => {
			this.applySourceValue();
		}, interval);

		this.setDisabled_(true);
	}

	applyModel_() {
	}

	onModelChange_() {
		this.applyModel_();
	}

	onControlChange_(sender, value) {
		this.model_.setValue(value);
	}
}

module.exports = PropertyController;
