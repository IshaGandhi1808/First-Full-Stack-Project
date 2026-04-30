let monument = allListing[0].geometry.coordinates;
const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: monument,
  zoom: 6,
});

map.addControl(new maplibregl.FullscreenControl()); // full screen map

// create the popup
const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
  `<p class = "fw-semibold"> ${allListing[0].location} </p>`,
);

// create DOM element for the marker
const el = document.createElement("div");
el.id = "marker";

const marker = new maplibregl.Marker({ element: el })
  .setLngLat(monument)
  .setPopup(popup)
  .addTo(map);
