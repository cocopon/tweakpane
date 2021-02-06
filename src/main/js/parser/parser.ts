/**
 * @hidden
 */
export type Parser<In, Ex> = (text: In) => Ex | null;
