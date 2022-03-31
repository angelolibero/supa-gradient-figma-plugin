export type GradientStops = ReadonlyArray<ColorStop>;

export type Palette = {
    offset: number;
    color: string;
}[];

export type Preferences = {
    liveUpdates?: boolean;
    updateStyles?: boolean;
};
