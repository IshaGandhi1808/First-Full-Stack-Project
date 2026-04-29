const monument = listing.geometry.coordinates;

const map = new maplibregl.Map({
  container: "map", // container id
  // style: 'https://demotiles.maplibre.org/globe.json', // style URL
  style: "https://tiles.openfreemap.org/styles/liberty",

  // --- satellite style ----
  // style: {
  //   version: 8,
  //   sources: {
  //     esri: {
  //       type: "raster",
  //       tiles: [
  //         "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  //       ],
  //       tileSize: 256
  //     }
  //   },
  //   layers: [
  //     {
  //       id: "esri-layer",
  //       type: "raster",
  //       source: "esri"
  //     }
  //   ]
  // },

  // --- satellite style ----

  center: monument, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// // show country name only

// map.on('load', () => {
//   // Add a source for the state polygons.
//   map.addSource('countries', {
//     type: 'geojson',
//     data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
//   });

//   // Add a layer showing the state polygons.
//   map.addLayer({
//     id: 'countries-layer',
//     type: 'fill',
//     source: 'countries',
//     paint: {
//         'fill-color': 'rgba(100, 150, 240, 0.4)',
//         'fill-color': 'rgba(0, 0, 0, 0)',
//         // 'fill-outline-color': 'rgba(0, 0, 0, 0.5)'
//     }
//   });

//   // When a click event occurs on a feature in the states layer, open a popup at the
//   // location of the click, with description HTML from its properties.
//   map.on('click', 'countries-layer', (e) => {
//       new maplibregl.Popup()
//           .setLngLat(e.lngLat)
//           .setHTML(e.features[0].properties.name)
//           .addTo(map);
//   });

//   // Change the cursor to a pointer when the mouse is over the states layer.
//   map.on('mouseenter', 'countries-layer', () => {
//       map.getCanvas().style.cursor = 'pointer';
//   });

//   // Change it back to a pointer when it leaves.
//   map.on('mouseleave', 'countries-layer', () => {
//       map.getCanvas().style.cursor = '';
//   });
// });

map.addControl(new maplibregl.FullscreenControl()); // Add Full screen control

// create the popup
const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
  `<h5 class = "fw-semibold"> ${listing.title} </h5><p>Exact Locations will be provided after booking.</p>`,
);

// create DOM element for the marker
const el = document.createElement("div");
el.id = "marker";

const marker = new maplibregl.Marker({
  color: "#cc0c0c",
  anchor: "center",
  element: el,
})
  .setLngLat(monument)
  .setPopup(popup) // sets a popup on this marker
  .addTo(map);

map.on("click", async (e) => {
  const { lng, lat } = e.lngLat;

  // Reverse geocoding (lat/lon → city)
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  const res = await fetch(url);
  const data = await res.json();

  //   const address = data.address || {};

  //   const city =
  //     address.city || address.town || address.village || address.hamlet || "";

  //   let moreDetails = `   ${address.tourism || ""} ${address.road || ""} ${address.suburb || ""} ${address.residential || ""} ${city} ${address.county || ""} ${address.state_district || ""} ${address.state || ""}  ${address.country}`;

  new maplibregl.Popup()
    .setLngLat([lng, lat])
    .setHTML(`<b>Address:</b>  ${data.display_name}`)
    .addTo(map);
});
