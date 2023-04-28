mapboxgl.accessToken = token;
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 10,
  center: campground.geometry.coordinates,
});
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
  )
  .addTo(map);
