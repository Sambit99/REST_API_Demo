console.log('Hello from the client side :D');

const locations = JSON.parse(document.querySelector('#map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2FtYml0OTkiLCJhIjoiY2t3MGZ1Z3ZsOXNjMDMwcXBtdHA1dnprMyJ9.E-vgg0MXMJZJArdebhaKXw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/sambit99/ckw1o9ttx1ef416pd8mhhaj75',
  // interactive: false,
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create Marker
  const el = document.createElement('div');
  el.classList.add('marker');

  // Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add Popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
    .addTo(map);
  // Extend map bounds
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
