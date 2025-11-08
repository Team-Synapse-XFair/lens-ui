import {
	Map,
	MapMarker,
	MapPopup,
	MapTileLayer,
	MapZoomControl,
    MapLocateControl
} from '@/components/ui/map';

export default function SmallMap({ latitude, longitude, markerText, zoom }) {
	const coords = [latitude, longitude];
	return (
		<Map
			center={coords}
			zoom={zoom || 15}
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
            <MapLocateControl />
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
