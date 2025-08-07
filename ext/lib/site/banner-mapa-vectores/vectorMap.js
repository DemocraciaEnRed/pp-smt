import React, { useState } from 'react'
import * as L from 'leaflet'
import leafletPip from '@mapbox/leaflet-pip'
import data from './distritos.json'
import config from 'lib/config'
import zonaStore from 'lib/stores/zona-store'


export default class VectorMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            src: '',
            text: '',
            topics: null,
            zona: null,
            zonas: [], // Una sola vez desde el store
        }
        this.map = null;
        this.markersGroup = null;

    }

    componentDidUpdate = (prevProps) => {
        const { topics } = this.props
        var locationIcon = L.icon({
            iconUrl: '/ext/lib/site/banner-mapa-vectores/locationDot.png',
            iconSize: [28, 35],
            iconAnchor: [20, 40],
            popupAnchor: [-6, -38],
        });
        // Limpiar marcadores anteriores
        this.markersGroup.clearLayers();
        if (topics && topics.length) {

            // Agregar nuevos
            for (var i = 0; i < topics.length; i++) {
                var t = topics[i];
                var [lat, lng] = t.attrs.coordinates.split(', ')
                if (!isNaN(lat) && !isNaN(lng)) {
                    var marker = L.marker([lat, lng], {
                        icon: locationIcon
                    }).bindPopup('<a href="/propuestas/topic/' + t.id + '"><strong>' + (t.mediaTitle || 'Sin título') + '</strong></a><br/>' +
                        'Barrio: ' + (t.attrs.barrio || 'Desconocido') + '<br/>');
                    this.markersGroup.addLayer(marker);
                } else {
                    let geoZona = null
                    this.map.eachLayer(function (layer) {
                        if (layer instanceof L.GeoJSON) {
                            layer.eachLayer(layer => {
                                if (layer.feature.properties.numero === t.zona.numero) geoZona = layer
                            })
                        }
                    });
                    var { lat, lng } = geoZona.getBounds().getCenter()
                    var marker = L.marker([lat, lng], {
                        icon: locationIcon
                    }).bindPopup('<a href="/propuestas/topic/' + t.id + '"><strong>' + (t.mediaTitle || 'Sin título') + '</strong></a><br/>' +
                        'Barrio: ' + (t.attrs.barrio || 'Desconocido') + '<br/>');
                    this.markersGroup.addLayer(marker);
                }
            }
            this.markersGroup.addTo(this.map);
        }
    }

    componentDidMount() {
        var self = this;


        const map = L.map('map').setView([-26.840933, -65.218621], 13);
        this.map = map;
        // 1. Tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        this.markersGroup = L.layerGroup().addTo(map);

        var geoJsonLayers = {};

        function onEachFeature(feature, layer) {
            var labelMarker = null;

            geoJsonLayers[feature.properties.id] = layer;

            function updateLabelVisibility() {
                if (self.map.getZoom() >= 13) {
                    if (!labelMarker) {
                        // Crear el label solo si no existe
                        labelMarker = L.marker(layer.getBounds().getCenter(), {
                            icon: L.divIcon({
                                className: 'labelPolygon',
                                html: feature.properties.name,
                                iconSize: [100, 40]
                            }),
                            interactive: false // Para que no interfiera con los clicks
                        }).addTo(map);
                    }
                } else {
                    // Eliminar el label si existe y el zoom es menor
                    if (labelMarker) {
                        map.removeLayer(labelMarker);
                        labelMarker = null;
                    }
                }
            }

            // Actualizar al cambiar el zoom
            self.map.on('zoomend', updateLabelVisibility);

            // Actualizar inicialmente
            updateLabelVisibility();

            // click on geojson polygon 
            layer.on('click', function () {
                let zonaSeleccionada = feature.properties.numero;
                self.props.action(self.state.zonas.find(zona => zona.numero == zonaSeleccionada)._id);
                geoJsonLayer.resetStyle()
                layer.setStyle({ color: '#0066ff' })


                var bounds = layer.getBounds();
                map.fitBounds(bounds);
            });

            // Limpiar al eliminar la capa
            layer.on('remove', function () {
                if (labelMarker) {
                    map.removeLayer(labelMarker);
                }
                self.map.off('zoomend', updateLabelVisibility);
            });
        }


        zonaStore.findAll().then((zonas) => {
            if (!this.props.votacion) {
                Object.keys(geoJsonLayers).forEach((layerId) => {
                    const feature = geoJsonLayers[layerId].feature
                    geoJsonLayers[layerId].bindPopup('<a href="/propuestas/?distrito=' + zonas.find(zona => zona.numero == feature.properties.numero)._id + '&tipoIdea=factible&years=2025"><strong> Ver todos los proyectos de este distrito </strong></a><br/>');
                })
            } else {
                Object.keys(geoJsonLayers).forEach((layerId) => {
                    const feature = geoJsonLayers[layerId].feature
                    geoJsonLayers[layerId].bindPopup(`<strong>${geoJsonLayers[layerId].feature.properties.name} seleccionado </strong>`);
                })
            }
            this.setState({ zonas: zonas });
        }).catch(function (err) {
            console.error('Error al cargar las zonas', err)
        });


        const geoJsonLayer = L.geoJSON(data, {
            style: function () {
                return { color: '#2eb1ff' };
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    }






    render() {

        return (
            <div>
                <div id='map' />
            </div>

        )
    }
}

