import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from '@/components/ui/map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SmallMap({ latitude, longitude, markerText }) {
    const TORONTO_COORDINATES = [43.6532, -79.3832]
    return (
        <Map
            center={TORONTO_COORDINATES}
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
        </Map>
    );
}