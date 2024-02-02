import { select } from 'd3';
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
    const { datasets, rotation } = state;

    if (datasets && datasets.worldAtlasData !== 'LOADING' && datasets.supplyChainData !== 'LOADING') {
        svg.call(map, {
            worldAtlasData: datasets.worldAtlasData,
            supplyChainData: datasets.supplyChainData,
            rotation
        });
    }

    if (datasets === undefined) {
        setState((state) => ({
            ...state,
            datasets: {
                worldAtlasData: 'LOADING',
                supplyChainData: 'LOADING',
            },
        }));
        fetch(worldAtlasURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
                const worldAtlasData = feature(
                    topoJSONData,
                    'countries'
                );
                setState((state) => ({
                    ...state,
                    datasets: {
                        ...state.datasets,
                        worldAtlasData,
                    },
                }));
        });
        fetch('./model/fake_supply_chain_data.json')
            .then((response) => response.json())
            .then((allSupplyChainData) => {
                // Function to shuffle the array
                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }
        
                // Shuffle the array
                shuffleArray(allSupplyChainData);

                const supplyChainData = allSupplyChainData.slice(0, 60);

                setState((state) => ({
                    ...state,
                    datasets: {
                        ...state.datasets,
                        supplyChainData,
                    },
                }));
        });
    }

};

