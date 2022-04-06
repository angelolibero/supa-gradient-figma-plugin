export type GradientStopType = ColorStop & {id?: number};
export type GradientStopsType = ReadonlyArray<GradientStopType>;
export type StopCoordiantes = {clientX: number; clientY: number};

export type Palette = ColorStop[];

export type Preferences = {
    liveUpdates?: boolean;
    updateStyles?: boolean;
};

export type AxisType = {
    x: number;
    y: number;
};

export type GradientPaintType = 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';
