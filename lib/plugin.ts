/**
 * A base interface of the plugin.
 */
export interface BasePlugin {
	/**
	 * The identifier of the plugin.
	 */
	id: string;

	/**
	 * The custom CSS for the plugin.
	 */
	css?: string;
}
