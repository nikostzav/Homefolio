import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import "../styles.css";
import { Link } from "react-router-dom";
import { cloudinaryResize } from "../../lib/cloudinary";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function SetViewOnClick({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords]);

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

const Map = ({ coords, data2 }) => {
  const [popupLocked, setPopupLocked] = useState(false); // State to lock the popup open when clicked
  const [openByHover, setOpenByHover] = useState(false); // State to track if popup was opened by hover

  const handleMarkerMouseOver = (event) => {
    if (!popupLocked) {
      event.target.openPopup(); // Open the popup on hover
      setOpenByHover(true); // Mark that the popup is opened by hover
    }
  };

  const handleMarkerMouseOut = (event) => {
    if (!popupLocked && openByHover) {
      const marker = event.target;
      setTimeout(() => {
        const popup = marker.getPopup();
        if (popup && !popup._container.matches(":hover")) {
          marker.closePopup(); // Close popup if the mouse is not over the popup
          setOpenByHover(false); // Reset hover state
        }
      }, 300); // Delay added to avoid abrupt closing
    }
  };

  const handlePopupMouseOut = (event) => {
    const popup = event.target;
    const marker = popup._source;
    if (!popupLocked && !popup._container.matches(":hover")) {
      marker.closePopup(); // Close popup when the mouse leaves the popup and it's not locked
      setOpenByHover(false); // Reset hover state
    }
  };

  const handleMarkerClick = (event) => {
    if (!popupLocked) {
      setPopupLocked(true); // Lock popup on click
      event.target.openPopup(); // Open popup on click
    } else {
      setPopupLocked(false); // Unlock if clicked again to close
      event.target.closePopup(); // Close the popup when clicked again
    }
  };
  function renderMap(lat, long, zoom) {
    return (
      <MapContainer
        center={coords}
        zoom={6}
        scrollWheelZoom={true}
        className="map border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick coords={coords} />
        <MapResizeHandler />
        {data2
          ? data2.map((d) => {
              return (
                <Marker
                  key={d.id}
                  position={[d.latitude, d.longitude]}
                  eventHandlers={{
                    mouseover: handleMarkerMouseOver,
                    mouseout: handleMarkerMouseOut,
                    click: handleMarkerClick, // Handle locking on click
                  }}
                >
                  <Popup
                    interactive={true} // Allow interaction with the popup
                    closeButton={true} // Allow manual closing
                    onClose={() => {
                      setPopupLocked(false); // Reset lock when popup is manually closed
                      setOpenByHover(false); // Reset hover state after manual close
                    }}
                    eventHandlers={{
                      mouseout: handlePopupMouseOut,
                    }}
                  >
                    <div className="container d-flex gap-3">
                      <div className="border border-black rounded">
                        <Link to={`/singleItem/${d.id}`}>
                          <img
                            src={cloudinaryResize(d.images[0], { width: 300, height: 200 })}
                            alt={d.title}
                            loading="lazy"
                            style={{ height: "100px", width: "150px" }}
                          />
                        </Link>
                      </div>
                      <div className="container d-flex flex-column gap-1">
                        <Link to={`/singleItem/${d.id}`}>
                          <div
                            className="h6 title-truncate"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2, // Limits to 2 lines
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: "1.2em", // Adjust line height if needed
                              maxHeight: "2.4em", // Ensures truncation after two lines
                            }}
                          >
                            <b>{d.title}</b>
                          </div>
                        </Link>
                        <div className="">
                          <b>{d.bedroom} bedroom</b>
                        </div>
                        <div>
                          <b>$ {d.price}</b>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          : null}
      </MapContainer>
    );
  }
  useEffect(() => {
    renderMap({ coords });
  }, [coords]);

  return <>{renderMap({ coords })}</>;
};

export default Map;
