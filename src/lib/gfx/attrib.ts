import type { VertexType } from "./vertex";

export type AttribLocation = {
	attrib: string;
	location: number;
};

export type AttribLocations = Record<VertexType, AttribLocation>;

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
