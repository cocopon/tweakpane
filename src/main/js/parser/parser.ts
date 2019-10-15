/**
 * @hidden
 */
export type Parser<In, Out> = (text: In) => Out | null;
