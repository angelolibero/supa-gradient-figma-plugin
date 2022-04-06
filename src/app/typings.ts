export type GradientStopsType = ReadonlyArray<ColorStop>;

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
