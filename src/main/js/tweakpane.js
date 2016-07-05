import RootViewInterface from './interface/root_view_interface';
import RootView          from './view/root_view';

const Tweakpane = (opt_options) => {
	const rootView = new RootView();
	return new RootViewInterface(rootView, opt_options);
};

module.exports = Tweakpane;
