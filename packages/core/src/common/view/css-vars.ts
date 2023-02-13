const CSS_VAR_MAP = {
	containerUnitSize: 'cnt-usz',
};

/**
 * Gets a name of the internal CSS variable.
 * @param key The key for the CSS variable.
 * @return A name of the internal CSS variable.
 */
export function getCssVar(key: keyof typeof CSS_VAR_MAP): string {
	return `--${CSS_VAR_MAP[key]}`;
}
