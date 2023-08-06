import {
	MicroParser,
	MicroParsers,
	parseRecord,
} from '../../../common/micro-parsers.js';
import {deepMerge} from '../../../misc/type-util.js';

/**
 * A state object for blades.
 */
export type BladeState = Record<string, unknown>;

/**
 * A utility function for importing a blade state.
 * @param state The state object.
 * @param superImport The function to invoke super.import(), or null for no super.
 * @param parser The state micro parser object.
 * @param callback The callback function that will be called when parsing is successful.
 * @return true if parsing is successful.
 */
export function importBladeState<O extends BladeState>(
	state: BladeState,
	superImport: ((state: BladeState) => boolean) | null,
	parser: (p: typeof MicroParsers) => {
		[key in keyof O]: MicroParser<O[key]>;
	},
	callback: (o: O) => boolean,
): boolean {
	if (superImport && !superImport(state)) {
		return false;
	}
	const result = parseRecord(state, parser);
	return result ? callback(result) : false;
}

/**
 * A utility function for exporting a blade state.
 * @param superExport The function to invoke super.export(), or null for no super.
 * @param thisState The blade state from the current blade.
 * @return An exported object.
 */
export function exportBladeState(
	superExport: (() => BladeState) | null,
	thisState: BladeState,
): BladeState {
	return deepMerge(superExport?.() ?? {}, thisState);
}

/**
 * An interface that can import/export a state.
 */
export interface PropsPortable {
	/**
	 * Imports props.
	 * @param state The state object.
	 * @return true if successfully imported.
	 */
	importProps: (state: BladeState) => boolean;

	/**
	 * Exports props.
	 * @return An exported object.
	 */
	exportProps: () => BladeState;
}
