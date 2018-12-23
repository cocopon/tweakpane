// @flow

export function selectContainer(marker: string): HTMLElement | null {
	return document.querySelector(`.common-paneContainer-${marker}`);
}
