interface IKeys {
    places: string,
    drawing: string,
    geometry: string,
    localContext: string,
    visualization: string
};

export interface ILibraries {
    libraries: [keyof IKeys];
};
export const libraries: Array<keyof IKeys> = ['places'];