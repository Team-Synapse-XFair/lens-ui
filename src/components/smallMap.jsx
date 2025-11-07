import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from '@/components/ui/map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SmallMap({ latitude, longitude, markerText }) {
    const coords = [latitude, longitude];
    return (
        <Map
            center={coords}
            zoom={13}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            zoomControl={false}
            boxZoom={false}
            keyboard={false}
            attributionControl={false}
        >
            <MapTileLayer />
            <MapMarker position={coords}>
                {markerText && (
                    <MapPopup>
                        <span>{markerText}</span>
                    </MapPopup>
                )}
            </MapMarker>
            <MapZoomControl position="topright" />
        </Map>
    );
}