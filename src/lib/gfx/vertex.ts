export type VertexType = "position" | "texcoord";
export type VertexSize = 1 | 2 | 3 | 4;

export function isVertexSize(size: number): size is VertexSize {
	return [1, 2, 3, 4].includes(size);
}

// this assumes that the primitive type is always a 32-bit float
export type VertexComponent = {
	type: VertexType;
	size: VertexSize;
};

export type VertexFormat = VertexComponent[];

export function vertexFormatSize(format: VertexFormat): number {
	return format.reduce((sum, fmt) => sum + fmt.size, 0);
}

export function vertexFormatStride(format: VertexFormat): number {
	return vertexFormatSize(format) * 4;
}
