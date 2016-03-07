const FolderView = require('../view/folder_view');
const Controller = require('./controller');

class FolderController extends Controller {
	constructor() {
		super();

		this.view_ = new FolderView();
	}
}

module.exports = FolderController;
