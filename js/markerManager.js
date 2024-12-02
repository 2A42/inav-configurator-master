const ol = require('openlayers');

class MarkerManager {
    constructor(vectorSource) {
        this.vectorSource = vectorSource; // ��������� �������� ��� ���� ��������

        this.isDrawing = false; // ���� ��� ������������ ��������� ���������
        this.currentLine = null; // �������� ������� �����
        this.lineStyle = null;
    }

    /**
     * ������� ������ � �������
     * @param {Array<number>} coordinate ���������� [x, y]
     * @param {string} name ��� �������
     * @param {string} description �������� �������
     * @param {string} color ���� ������ �������
     * @param {number} fontSize ������ ������ (� ��������)
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
     * ������� ������ � �������
     * @param {Array<number>} coordinate ���������� [x, y]
     * @param {string} iconUrl URL ������
     * @param {string} name ��� �������
     * @param {string} description �������� �������
     * @param {number} scale ������� ������
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

    setLineStyle(styleConfig) {
        this.lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: styleConfig.color || 'blue',
                width: styleConfig.width || 2,
                lineDash: styleConfig.lineDash || null,
            }),
        });
    }
    
    /**
     * ������ ��������� �����
     * @param {Array<number>} startCoordinate - ��������� ���������� �����
     * @returns {ol.Feature} - ��������� ������ �����
     */
    startDrawingLine(startCoordinate, styleConfig) {
        this.isDrawing = true;
        this.currentLine = new ol.Feature({
            geometry: new ol.geom.LineString([startCoordinate]),
        });

        this.setLineStyle(styleConfig);
        // ���������� ����� � �����
        this.currentLine.setStyle(this.lineStyle);
        

        return this.currentLine;
    }

    /**
     * ���������� ��������� �����
     * @param {Array<number>} coordinate - ������� ���������� ��� ����������
     */
    continueDrawingLine(coordinate) {
        if (!this.isDrawing || !this.currentLine) return;

        const geometry = this.currentLine.getGeometry();
        geometry.appendCoordinate(coordinate);
    }

    /**
     * ��������� ��������� �����
     */
    stopDrawingLine() {
        this.isDrawing = false;
        this.currentLine = null;
    }

    /**
     * �������� ���������� �������
     * @param {ol.Feature} marker ������
     * @returns {Array<number>} ���������� [x, y]
     */
    getMarkerCoordinates(marker) {
        return marker.getGeometry().getCoordinates();
    }

    /**
     * ������ ���������� �������
     * @param {ol.Feature} marker ������
     * @param {Array<number>} coordinates ����� ���������� [x, y]
     */
    setMarkerCoordinates(marker, coordinates) {
        marker.getGeometry().setCoordinates(coordinates);
    }

    /**
     * �������� �������� ������� (���, ��������, ���� � �.�.)
     * @param {ol.Feature} marker ������
     * @param {string} property �������� ��������
     * @returns {*} �������� ��������
     */
    getMarkerProperty(marker, property) {
        return marker.get(property);
    }

    /**
     * ������ �������� ������� (���, ��������, ���� � �.�.)
     * @param {ol.Feature} marker ������
     * @param {string} property �������� ��������
     * @param {*} value �������� ��������
     */
    setMarkerProperty(marker, property, value) {
        marker.set(property, value);

        // ���� ���������� ����� ������, ��������� �����
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
     * ������� ������
     * @param {ol.Feature} marker ������
     */
    removeMarker(marker) {
        //this.vectorSource.removeFeature(marker);
    }

    /**
     * �������� ��� �������
     */
    clearAllMarkers() {
        //this.vectorSource.clear();
    }
}

module.exports = MarkerManager;