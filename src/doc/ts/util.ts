export function selectContainer(marker: string, console = false): HTMLElement {
	const postfix = marker + (console ? 'console' : '');
	const selector = `*[data-pane-${postfix}]`;
	const elem = document.querySelector(selector);
	if (!elem) {
		throw Error(`container not found: ${selector}`);
	}
	return elem as HTMLElement;
}

export function wave(t: number): number {
	const p = t * 0.02;
	return (
		((3 * 4) / Math.PI) *
		(Math.sin(p * 1 * Math.PI) +
			Math.sin(p * 3 * Math.PI) / 3 +
			Math.sin(p * 5 * Math.PI) / 5) *
		0.25
	);
}
