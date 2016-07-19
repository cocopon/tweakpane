import { tokens, styles } from '../tweakpane.css.js'

const style = document.createElement("style");
style.appendChild(document.createTextNode(atob(styles)));
document.head.appendChild(style);

class ClassName {
	static get(block, opt_element, opt_modifier) {
		let result = `tp${block}`;
		if (opt_element) {
			result += `_${opt_element}`;
		}
		if (opt_modifier) {
			result += `-${opt_modifier}`;
		}
		return tokens[result];
	}
}

export default ClassName;
