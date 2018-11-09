// @flow

export function selectContainer(marker: string): ?HTMLElement {
	return document.querySelector(`.common-paneContainer-${marker}`);
}
