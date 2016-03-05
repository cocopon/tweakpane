const FolderView = require('../view/folder_view');
const Controller = require('./controller');

class FolderController extends Controller {
	instanciateView_() {
		return new FolderView();
	}
}

module.exports = FolderController;
