import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import "../styles.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}

// Leaflet sizes its tile grid once on mount; if the container is resized
// afterward (window resize, or the layout switching between stacked and
// side-by-side breakpoints) the map keeps the stale size and stops
// rendering tiles until told to remeasure.
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

const SingleItemMap = ({ coords, lat, long }) => {
  const coords2 = [lat, long];

  function renderMap(lat, long, zoom) {
    return (
      <MapContainer
        center={coords2}
        zoom={14}
        scrollWheelZoom={false}
        className="map border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick coords={coords} />
        <MapResizeHandler />
        <Marker position={coords2}></Marker>
      </MapContainer>
    );
  }
  useEffect(() => {
    renderMap({ coords });
  }, [coords]);

  return <>{renderMap({ coords })}</>;
};

export default SingleItemMap;
