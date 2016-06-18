/* global PhysicsSketch: false */

(() => {
	let sketch = null;

	var pane = Tweakpane({
		foldable: false,
		container: document.getElementsByClassName('hero_paneContainer').item(0)
	});
	pane.add({slider: 0}, 'slider', {
		min: 0.0,
		max: 1.0,
	}).on('change', (value) => {
		if (sketch === null) {
			sketch = new PhysicsSketch(
				document.getElementById('heroSketch')
			);
		}
		sketch.updateLevel(value);
	});

	class Menu {
		constructor(buttonElem, bodyElem) {
			this.buttonElem_ = buttonElem;
			this.bodyElem_ = bodyElem;

			this.expanded_ = false;

			this.buttonElem_.addEventListener(
				'click',
				this.onButtonClick_.bind(this)
			);

			window.addEventListener(
				'resize',
				this.onWindowResize_.bind(this)
			);
		}

		isExpanded() {
			return this.expanded_;
		}

		setExpanded(expanded) {
			const changed = (expanded !== this.expanded_);
			if (!changed) {
				return;
			}

			this.expanded_ = expanded;
			this.applyExpanded_();
		}

		applyExpanded_() {
			const expanded = this.expanded_;
			if (expanded) {
				this.bodyElem_.classList.add('menu_body-expanded');
				this.buttonElem_.classList.add('menu_button-expanded');
			}
			else {
				this.bodyElem_.classList.remove('menu_body-expanded');
				this.buttonElem_.classList.remove('menu_button-expanded');
			}
		}

		expandIfNeeded() {
			if (window.outerWidth > Menu.NARROW_WIDTH) {
				this.setExpanded(true);
			}
		}

		onButtonClick_() {
			this.setExpanded(!this.expanded_);
		}

		onWindowResize_() {
			this.expandIfNeeded();
		}
	}
	Menu.NARROW_WIDTH = 620 + 200 * 2;

	const menu = new Menu(
		document.getElementsByClassName('menu_button').item(0),
		document.getElementsByClassName('menu_body').item(0)
	);
	setTimeout(() => {
		menu.expandIfNeeded();
	}, 1000);
})();
