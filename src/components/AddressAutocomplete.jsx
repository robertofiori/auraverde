import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const libraries = ["places"];

export default function AddressAutocomplete({ onAddressSelect, onInputChange, defaultValue = "" }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
        language: "es", // Force Spanish
        region: "AR" // Bias towards Argentina
    });

    if (!isLoaded) return <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>;

    return <PlacesAutocomplete onAddressSelect={onAddressSelect} onInputChange={onInputChange} defaultValue={defaultValue} />;
}

function PlacesAutocomplete({ onAddressSelect, onInputChange, defaultValue }) {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "ar" }, // Limit to Argentina for now
        },
        debounce: 300,
        defaultValue
    });

    // Sync with default value on mount if provided
    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue, false);
        }
    }, [defaultValue, setValue]);

    const handleInput = (e) => {
        setValue(e.target.value);
        if (onInputChange) {
            onInputChange(e.target.value);
        }
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        // Also update parent state with the full address text immediately
        if (onInputChange) {
            onInputChange(address);
        }

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);

            // Extract components
            const components = results[0].address_components;
            let street = "";
            let number = "";
            let city = "";
            let province = "";
            let zip = "";

            components.forEach((component) => {
                if (component.types.includes("route")) street = component.long_name;
                if (component.types.includes("street_number")) number = component.long_name;
                if (component.types.includes("locality")) city = component.long_name;
                if (component.types.includes("administrative_area_level_1")) province = component.long_name;
                if (component.types.includes("postal_code")) zip = component.long_name;
            });

            // Pass parsed data back to parent
            onAddressSelect({
                fullAddress: address,
                street,
                number,
                city,
                province,
                zip,
                lat,
                lng
            });

        } catch (error) {
            console.error("Error geocoding address: ", error);
        }
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    search
                </span>
                <input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Buscar dirección (ej. Av Corrientes 1234)"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                />
                {value && (
                    <button
                        onClick={() => { setValue(""); clearSuggestions(); if (onInputChange) onInputChange(""); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {status === "OK" && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {data.map(({ place_id, description, structured_formatting }) => (
                        <li
                            key={place_id}
                            onClick={() => handleSelect(description)}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b last:border-0 border-gray-50 dark:border-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">location_on</span>
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-gray-200 text-sm">
                                        {structured_formatting.main_text}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400">
                                        {structured_formatting.secondary_text}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
