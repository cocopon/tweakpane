export function selectContainer(marker: string): HTMLElement | null {
	return document.querySelector(`*[data-pane-${marker}]`);
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
