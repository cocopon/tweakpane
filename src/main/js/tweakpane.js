import FolderViewInterface from './interface/folder_view_interface';
import RootViewInterface   from './interface/root_view_interface';
import ComponentUtil       from './misc/component_util';
import RootView            from './view/root_view';

// Assign here to avoid circular reference
FolderViewInterface.componentUtil__ = ComponentUtil;

export default function Tweakpane(opt_options) {
	const rootView = new RootView();
	return new RootViewInterface(rootView, opt_options);
};
