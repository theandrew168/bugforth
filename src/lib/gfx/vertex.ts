/**
 * A single vertex type.
 */
export type VertexType = "position" | "texcoord";

/**
 * The size of a vertex (in number of values).
 */
export type VertexSize = 1 | 2 | 3 | 4;

/**
 * Type guard for checking if a number is a valid vertex size.
 * @param size Numeric value to check for being a valid vertex size.
 */
export function isVertexSize(size: number): size is VertexSize {
	return [1, 2, 3, 4].includes(size);
}

/**
 * An individual component of a vertex array.
 */
export type VertexComponent = {
	type: VertexType;
	size: VertexSize;
};

/**
 * The multi-component format of a vertex array.
 */
export type VertexFormat = VertexComponent[];

/**
 * Get the size (in number of values) of a vertex format.
 * @param format The vertex format in being checked.
 */
export function vertexFormatSize(format: VertexFormat): number {
	return format.reduce((sum, fmt) => sum + fmt.size, 0);
}

/**
 * Get the stride (length per vertex) of a vertex format (in bytes).
 * This assumes that all vertex values are 32 bit (4 byte) floats.
 * @param format The vertex format in being checked.
 */
export function vertexFormatStride(format: VertexFormat): number {
	return vertexFormatSize(format) * 4;
}
