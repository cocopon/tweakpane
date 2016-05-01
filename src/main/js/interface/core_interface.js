const ButtonView            = require('../view/button_view');
const FolderView            = require('../view/folder_view');
const SeparatorView         = require('../view/separator_view');
const ButtonViewInterface   = require('./button_view_interface');
const FolderViewInterface   = require('./folder_view_interface');
const PropertyViewInterface = require('./property_view_interface');

class CoreInterface {
	constructor(core) {
		this.core_ = core;
	}

	getElement() {
		return this.core_.getRootView().getElement();
	}

	add(target, propName, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = this.core_.addProperty(
			target, propName, options
		);
		return new PropertyViewInterface(propView);
	}

	monitor(target, propName, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;

		const propView = this.core_.addProperty(
			target, propName, options
		);
		return new PropertyViewInterface(propView);
	}

	addFolder(title) {
		const folderView = new FolderView(title);
		const parentView = this.core_.getRootView().getMainView();
		parentView.addSubview(folderView);
		return new FolderViewInterface(folderView);
	}

	addButton(title) {
		const buttonView = new ButtonView(title);
		const parentView = this.core_.getRootView().getMainView();
		parentView.addSubview(buttonView);
		return new ButtonViewInterface(buttonView);
	}

	addSeparator() {
		const separatorView = new SeparatorView();
		const parentView = this.core_.getRootView().getMainView();
		parentView.addSubview(separatorView);
	}

	getJson() {
		return this.core_.getJson();
	}

	setJson(json) {
		return this.core_.setJson(json);
	}

	on(eventName, handler, opt_scope) {
		const emitter = this.core_.getEmitter();
		emitter.on(eventName, handler, opt_scope);
		return this;
	}

	off(eventName, handler, opt_scope) {
		const emitter = this.core_.getEmitter();
		emitter.off(eventName, handler, opt_scope);
		return this;
	}

	refresh() {
		// Delay refresh for waiting all properties update
		setTimeout(() => {
			this.core_.refreshProperties();
		});
	}
}

module.exports  = CoreInterface;
