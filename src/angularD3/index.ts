export * from './directives/arc';
export * from './directives/area';
export * from './directives/axis';
export * from './directives/bars';
export * from './directives/chart';
export * from './directives/data';
export * from './directives/line';
export * from './directives/pie';

import {D3Arc} from './directives/arc';
import {D3Area} from './directives/area';
import {D3Axis} from './directives/axis';
import {D3Bars} from './directives/bars';
import {D3Chart, D3Margin} from './directives/chart';
import {D3Data} from './directives/data';
import {D3Line} from './directives/line';
import {D3Pie} from './directives/pie';

export const D3_DIRECTIVES: Function[] = [
    D3Arc,
    D3Area,
    D3Axis,
    D3Bars,
    D3Chart,
    D3Data,
    D3Line,
    D3Margin,
    D3Pie,
];
