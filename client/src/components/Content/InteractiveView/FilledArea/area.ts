type Point = {
    x: number;
    y: number;
}

type Area = {
    points: Point[];
    /**
     * example: 'rgb(200, 0, 0, 0.3)'
     */
    colorRGBA: string;
}

export type { Point, Area };