class ViewUtil {
	static getAllSubviews(view) {
		let views = view.getSubviews();
		let index = 0;
		while (index < views.length) {
			const view = views[index];
			views = views.concat(view.getSubviews());
			++index;
		}
		return views;
	}
}

export default ViewUtil;
