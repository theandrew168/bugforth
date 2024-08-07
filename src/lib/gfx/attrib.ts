import type { VertexType } from "./vertex";

/**
 * A WebGL vertex shader attribute.
 */
export type AttribLocation = {
	attrib: string;
	location: number;
};

/**
 * A mapping of vertex types to attrib locations.
 */
export type AttribLocations = Record<VertexType, AttribLocation>;

/**
 * The static attrib locations used by the 2D sprite renderer.
 */
export const ATTRIB_LOCATIONS: AttribLocations = {
	position: {
		attrib: "aPosition",
		location: 0,
	},
	texcoord: {
		attrib: "aTexCoord",
		location: 1,
	},
};
