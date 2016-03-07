class Appearance {
	static apply() {
		if (document.getElementById(this.ELEMENT_ID) !== null) {
			return;
		}

		const styleElem = document.createElement('style');
		styleElem.id = this.ELEMENT_ID;
		styleElem.textContent = this.CSS;
		document.head.appendChild(styleElem);
	}
}

Appearance.ELEMENT_ID = 'ssjsDefaultStyle';
Appearance.CSS = '.css_replace_me{}';

module.exports = Appearance;
