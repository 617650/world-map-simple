import { geoAzimuthalEquidistant, geoPath, geoGraticule } from 'd3';

const width = window.innerWidth;
const height = window.innerHeight;

const projection = geoAzimuthalEquidistant()
  .scale(height / 7)
  .translate([width / 2, height / 2])
  .center([0,0]);
const path = geoPath(projection);
const graticule = geoGraticule();
const globeOutline = { type: "Sphere" };

export const map = (selection, { data, rotation }) => {

    projection.rotate(rotation);

    selection
      .selectAll('path.graticule')
      .data([null])
      .join('path')
      .attr('class', 'graticule')
      .attr('d', path(graticule()))
      .attr('fill', 'none')
      .attr('stroke', '#BBB')
      .attr('stroke-width', 0.5);
  
    selection
      .selectAll('globe.outline')
      .data([globeOutline])  // Use a Sphere object to represent the globe outline
      .join('path')
      .attr('class', 'outline')
      .attr('d', path)  // Use the path generator to draw the outline
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  
    selection
      .selectAll('path.country')
      .data(data.features)
      .join('path')
      .attr('d', path)
      .attr('class', 'country')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);
  };

