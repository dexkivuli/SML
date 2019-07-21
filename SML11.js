// Leaflet interactive map showing Suitability for Machine Learning, Tim Murray, last edited 190721

// Set starting view point in latitude and longitude
	var map = L.map('map').setView([-32, 132], 5);

// Layer base tile from open maps	
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                id: 'mapbox.light'
	}).addTo(map);

	
// Create an info panel on the map note: CSS formatting in main html
	var info = L.control();
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	
// Function to update the info panel based on teh feature data pased from the hover input
	info.update = function (props) {
		this._div.innerHTML = '<strong>' +  (props ? 
			props.SA2_NAME16 + '</strong></b><br/>Decile: ' + props.quantile10
			: 'Hover your cursor over a region');
	};

	info.addTo(map);

// Function to assign colour to the map areas based on d value
	function getColor(d) {
		return          d > 9   ? '#ff0000' :
						d > 8   ? '#f20036' :
						d > 7   ? '#e40057' :
						d > 6   ? '#d50075' :
						d > 5   ? '#c40091' :
						d > 4   ? '#b100ab' :
						d > 3   ? '#9a00c3' :
						d > 2   ? '#7f00d9' :
						d > 1   ? '#5b00ed' :
						d > 0   ? '#0000ff' :
									'#808080';
	}
	
// Function to set style for areas within the map, borders and colour of fill
	function style(feature) {
		return {
			weight: 1,
			opacity: 0.6,
			color: 'white',
			fillOpacity: 0.6,
			fillColor: getColor(feature.properties.quantile10)
		};
	}


// Function to highlight feature on the map layer, and to populate the info panel
	var geojson;
	function highlightFeature(e) {
	    var layer = e.target;
	
	    layer.setStyle({
	        weight: 4,
	        color: '#000000',
	        dashArray: '',
	        opacity: 0.4
	    });
	    info.update(layer.feature.properties);
	
	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	        layer.bringToFront();
	    }
	}

// Function to reset the highlight so that all previously highlighted areas don't stay lit up	
	function resetHighlight(e) {
	    geojson.resetStyle(e.target);
	    info.update();
	}
	
// Function for fixed point display for the popup that can handle NULL	
	function newtoFixed(x,y) {
		if ( x || x==0 ) { return Number(x).toFixed(y) }
		else { return x };
	}


// Function so that each feature can have a popup and mouse hover events	
	function onEachFeature(feature, layer) {
		if ( feature.properties.mSML !== null ) {
			layer.bindPopup(
				"<div align=\"center\"><h3>" + feature.properties.SA2_NAME16 + "</div></h3>" +
				
				"<div align=\"center\">(This region's standardised relative risk is "  + newtoFixed(feature.properties.mSML,2) + ")</div>" +
				
				"<table>"+
				"  <thead>"+
				"	<tr>"+
				"	  <th scope=\"col\" class=\"data-left\">Most exposed occupations</th>"+
				"	</tr>"+
				"  </thead>"+
				"  <tbody>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.High1 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.High2 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.High3 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.High4 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.High5 + "</td>"+
				"	</tr>"+
				"  </tbody>"+
				"</table>" +
				
				"<table>"+
				"  <thead>"+
				"	<tr>"+
				"	  <th scope=\"col\" class=\"data-left\">Least exposed occupations</th>"+
				"	</tr>"+
				"  </thead>"+
				"  <tbody>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.Low1 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.Low2 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.Low3 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.Low4 + "</td>"+
				"	</tr>"+
				"	<tr>"+
				"	  <td class=\"data-left\">" + feature.properties.Low5 + "</td>"+
				"	</tr>"+
				"  </tbody>"+
				"</table>"

			
			, {'maxWidth': '500'});
			layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight
			});
		};
		if ( feature.properties.mSML == null ) {
					layer.bindPopup(
						"<div align=\"center\"><h3>" + feature.properties.SA2_NAME16 + "</div></h3>" +
						
						"<div align=\"center\">(A Suitability for Machine Learning Score was not calculated due to insufficient data)</div>"
					, {'maxWidth': '500'});
		};
	};
// Create the map layer from the geojson read from the javascript in the html	
	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

console.log(geojson)