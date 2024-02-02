import { 
  geoAzimuthalEquidistant, 
  geoAzimuthalEqualArea, 
  geoStereographic, 
  geoOrthographic, 
  geoConicConformal, 
  geoMercator, 
  geoNaturalEarth1,
  geoTransverseMercator,
  geoPath, 
  geoGraticule, 
  geoInterpolate, 
  select } from 'd3';
import { animateParticles } from './particles';

const width = window.innerWidth;
const height = window.innerHeight;

// Set up the projection and path generator
const projection = geoAzimuthalEquidistant()
  .scale(height / 7)
  .translate([width / 2, height / 2])
  .center([0,0]);
const path = geoPath(projection);
const graticule = geoGraticule();
const globeOutline = { type: "Sphere" };
const pathGenerator = geoPath().projection(projection);

// Set up the base map div
const baseMap = select('#baseMap');
const baseMapSvg = baseMap.append('svg')
  .attr('width', width)
  .attr('height', height);

// Set up the particle canvas
const particleCanvas = document.getElementById('particleCanvas');
const particleContext = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

// Generate points along the path that the particles can follow
const generateGreatArcPoints = (start, end, projection, numPoints = 100) => {
  const coordinates = [];
  const interpolate = geoInterpolate(start, end); // Get all interpolated points through geoInterpolate
  for (let i = 0; i <= numPoints; i++) {
    const point = interpolate(i / numPoints);
    coordinates.push(projection(point));
  }
  return coordinates;
};

export const map = (selection, { worldAtlasData, supplyChainData, rotation }) => {

    const updateSupplyChains = () => {
      selection.selectAll('path.supply-chain')
        .attr('d', d => {
          const link = {
            type: "LineString",
            coordinates: [d.depart, d.arrive]
          };
          return pathGenerator(link);
        });
    };

    const paths = supplyChainData.map(d => {
      const start = d.depart;
      const end = d.arrive;
      return generateGreatArcPoints(start, end, projection);
    });

    projection.rotate(rotation);
    //console.log(rotation);

    updateSupplyChains(); 

    baseMapSvg.selectAll('*').remove();

    animateParticles(paths, particleContext);

    // Draw graticule
    // baseMapSvg
    //   .selectAll('path.graticule')
    //   .data([null])
    //   .join('path')
    //   .attr('class', 'graticule')
    //   .attr('d', path(graticule()))
    //   .attr('fill', 'none')
    //   .attr('stroke', '#fff')
    //   .attr('opacity', 0.2)
    //   .attr('stroke-width', 0.5);
  
    // // Draw globe
    // baseMapSvg
    //   .selectAll('globe.outline')
    //   .data([globeOutline])
    //   .join('path')
    //   .attr('class', 'outline')
    //   .attr('d', path)  
    //   .attr('fill', '#63A0A4')
    //   .attr('stroke', '#63A0A4')
    //   .attr('stroke-width', 2)
    //   .attr('opacity', 0.2);
  
    // // Draw land
    // baseMapSvg
    //   .selectAll('path.country')
    //   .data(worldAtlasData.features)
    //   .join('path')
    //   .attr('d', path)
    //   .attr('class', 'country')
    //   .attr('fill', '#fff')
    //   .attr('stroke', '#fff')
    //   .attr('opacity', 0.3)
    //   .attr('stroke-width', 0);

    // // Draw supply chain lines
    // baseMapSvg
    //   .selectAll('path.supply-chain')
    //   .data(supplyChainData)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'supply-chain')
    //   .attr('d', d => {
    //     const link = {
    //       type: "LineString",
    //       coordinates: [d.depart, d.arrive]
    //     };
    //     return pathGenerator(link);
    //   })
    //   .attr('fill', 'none')
    //   .attr('stroke', 'blue')
    //   .attr('stroke-width', 2)
    //   .attr('opacity', 0);
  };

