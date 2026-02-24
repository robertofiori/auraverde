import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const libraries = ["places"];

export default function MapPreview({ lat, lng }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
        language: "es",
        region: "AR"
    });

    const center = useMemo(() => ({ lat: lat || -34.6037, lng: lng || -58.3816 }), [lat, lng]);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
    }), []);

    if (!isLoaded) return <div className="animate-pulse h-40 bg-gray-100 rounded-lg w-full"></div>;

    if (!lat || !lng) return null;

    return (
        <div className="w-full h-40 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 mt-3 mb-3">
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={15}
                options={mapOptions}
            >
                <Marker position={center} />
            </GoogleMap>
        </div>
    );
}
