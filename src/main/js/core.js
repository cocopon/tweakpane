const PropertyViewFactoryComplex = require('./factory/property_view_factory_complex');
const ButtonViewInterface        = require('./interface/button_view_interface');
const FolderViewInterface        = require('./interface/folder_view_interface');
const PropertyViewInterface      = require('./interface/property_view_interface');
const ClassName                  = require('./misc/class_name');
const Errors                     = require('./misc/errors');
const EventEmitter               = require('./misc/event_emitter');
const Style                      = require('./misc/style');
const ViewUtil                   = require('./misc/view_util');
const Model                      = require('./model/model');
const ButtonView                 = require('./view/button_view');
const FolderView                 = require('./view/folder_view');
const PropertyView               = require('./view/property_view');
const SeparatorView              = require('./view/separator_view');
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

	getElement() {
		return this.rootView_.getElement();
	}

	addProperty_(target, propName, options) {
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

	add(target, propName, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = this.addProperty_(
			target, propName, options
		);
		return new PropertyViewInterface(propView);
	}

	monitor(target, propName, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;

		const propView = this.addProperty_(
			target, propName, options
		);
		return new PropertyViewInterface(propView);
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

	/**
	 * Adds a folder.
	 * @param {string} title A title
	 * @return {FolderViewInterface}
	*/
	addFolder(title) {
		const folderView = new FolderView(title);
		const parentView = this.rootView_.getMainView();
		parentView.addSubview(folderView);
		return new FolderViewInterface(folderView);
	}

	/**
	 * Adds a button.
	 * @param {string} title A title
	 * @return {ButtonViewInterface}
	 */
	addButton(title) {
		const buttonView = new ButtonView(title);
		const parentView = this.rootView_.getMainView();
		parentView.addSubview(buttonView);
		return new ButtonViewInterface(buttonView);
	}

	/**
	 * Adds a separator.
	 */
	addSeparator() {
		const separatorView = new SeparatorView();
		const parentView = this.rootView_.getMainView();
		parentView.addSubview(separatorView);
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
			Core.EVENT_CHANGE,
			[prop.getModel().getValue(), prop]
		);
	}
}

Core.EVENT_CHANGE = 'change';

module.exports = Core;
