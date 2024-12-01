const ol = require('openlayers');

class MarkerManager {
    constructor(vectorSource) {
        this.vectorSource = vectorSource; // Векторный источник для всех маркеров
    }

    /**
     * Создать маркер с текстом
     * @param {Array<number>} coordinate Координаты [x, y]
     * @param {string} name Имя маркера
     * @param {string} description Описание маркера
     * @param {string} color Цвет текста маркера
     * @param {number} fontSize Размер текста (в пикселях)
     */
    createTextMarker(coordinate, name, description = '', color = 'black', fontSize = 14) {
        const marker = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
            name: name,
            description: description,
            color: color,
            fontSize: fontSize,
        });

        marker.setStyle(
            new ol.style.Style({
                text: new ol.style.Text({
                    text: name,
                    font: `${fontSize}px Arial, sans-serif`,
                    fill: new ol.style.Fill({ color: color }),
                    stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
                }),
            })
        );

        // this.vectorSource.addFeature(marker);
        return marker;
    }

    /**
     * Создать маркер с иконкой
     * @param {Array<number>} coordinate Координаты [x, y]
     * @param {string} iconUrl URL иконки
     * @param {string} name Имя маркера
     * @param {string} description Описание маркера
     * @param {number} scale Масштаб иконки
     */
    createIconMarker(coordinate, iconUrl, name, description = '', scale = 1) {
        const marker = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
            name: name,
            description: description,
            iconUrl: iconUrl,
            scale: scale,
        });

        marker.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: iconUrl,
                    scale: scale,
                }),
            })
        );

        //this.vectorSource.addFeature(marker);
        return marker;
    }

    /**
     * Получить координаты маркера
     * @param {ol.Feature} marker Маркер
     * @returns {Array<number>} Координаты [x, y]
     */
    getMarkerCoordinates(marker) {
        return marker.getGeometry().getCoordinates();
    }

    /**
     * Задать координаты маркера
     * @param {ol.Feature} marker Маркер
     * @param {Array<number>} coordinates Новые координаты [x, y]
     */
    setMarkerCoordinates(marker, coordinates) {
        marker.getGeometry().setCoordinates(coordinates);
    }

    /**
     * Получить свойство маркера (имя, описание, цвет и т.д.)
     * @param {ol.Feature} marker Маркер
     * @param {string} property Название свойства
     * @returns {*} Значение свойства
     */
    getMarkerProperty(marker, property) {
        return marker.get(property);
    }

    /**
     * Задать свойство маркера (имя, описание, цвет и т.д.)
     * @param {ol.Feature} marker Маркер
     * @param {string} property Название свойства
     * @param {*} value Значение свойства
     */
    setMarkerProperty(marker, property, value) {
        marker.set(property, value);

        // Если изменяется стиль текста, обновляем стиль
        if (property === 'name' || property === 'color' || property === 'fontSize') {
            const style = marker.getStyle();
            if (style && style.getText()) {
                style.getText().setText(marker.get('name'));
                style.getText().getFill().setColor(marker.get('color'));
                style.getText().setFont(`${marker.get('fontSize')}px Arial, sans-serif`);
            }
        }
    }

    /**
     * Удалить маркер
     * @param {ol.Feature} marker Маркер
     */
    removeMarker(marker) {
        //this.vectorSource.removeFeature(marker);
    }

    /**
     * Очистить все маркеры
     */
    clearAllMarkers() {
        //this.vectorSource.clear();
    }
}

module.exports = MarkerManager;