import { geoAzimuthalEquidistant, geoAzimuthalEqualArea, geoPath, geoGraticule, fitSize } from 'd3';

const width = window.innerWidth;
const height = window.innerHeight;

const projection = geoAzimuthalEquidistant()
  .scale(height / 7)
  .rotate([90, 0, 0])
  .translate([width / 2, height / 2])
  .center([0,0]);
const path = geoPath(projection);
const graticule = geoGraticule();

export const map = (selection, { data }) => {
    //projection.fitSize([width, height], data);
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
      .selectAll('path.outline')
      .data([null])
      .join('path')
      .attr('class', 'outline')
      .attr('d', path(graticule.outline()))
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  
    selection
      .selectAll('path.country')
      .data(data.features)
      .join('path')
      .attr('d', path)
      .attr('class', 'country')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);
  };

