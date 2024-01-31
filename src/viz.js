import { csvParse, select } from 'd3';
import { feature } from 'topojson-client';
import { map } from './map';

const worldAtlasURL = 'https://www.unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';

export const viz = (container, { state, setState }) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height);

    // state.data could be:
    // * undefined
    // * 'LOADING'
    // * An array of objects
    const { data, rotation } = state;

    if (data && data !== 'LOADING') {
        svg.call(map, {
            data,
            rotation
        });
    }

    if (data === undefined) {
        setState((state) => ({
            ...state,
            data: 'LOADING',
        }));
        fetch(worldAtlasURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
                const data = feature(
                    topoJSONData,
                    'countries'
                );
                console.log(data);
                setState((state) => ({
                    ...state,
                    data,
                }));
        });
    }

};

