import ClassName from '../misc/class_name';
import View      from './view';

class RootView extends View {
	constructor() {
		super();

		this.getElement().classList.add(
			ClassName.get(RootView.BLOCK_CLASS)
		);

		this.addSubview(new View());
		this.addSubview(new View());

		this.getMainView().getElement().classList.add(
			ClassName.get(RootView.BLOCK_CLASS, 'main')
		);
		this.getFooterView().getElement().classList.add(
			ClassName.get(RootView.BLOCK_CLASS, 'footer')
		);
	}

	getMainView() {
		return this.getSubviews()[0];
	}

	getFooterView() {
		return this.getSubviews()[1];
	}
}

RootView.BLOCK_CLASS = 'rtv';

export default RootView;
