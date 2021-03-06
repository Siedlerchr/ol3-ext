/*	Copyright (c) 2017 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
* Hexagonal grids
* @classdesc ol.HexGrid is a class to compute hexagonal grids 
* @see http://www.redblobgames.com/grids/hexagons
*
* @constructor ol.HexGrid
* @extends {ol.Object}
* @param {olx.HexGrid=} options
*	@param {Number} options.size size of the exagon in map units, default 80000
*	@param {ol.coordinate} options.origin orgin of the grid, default [0,0]
*	@param {pointy|flat} options.layout grid layout, default pointy
* @todo 
*/
ol.HexGrid = function (options)
{	options = options || {};
	
	ol.Object.call (this, options);

	// Options
	this.size_ = options.size||80000;
	this.origin_ = options.origin || [0,0];
	this.layout_ = this.layout[options.layout] || this.layout.pointy;

};
ol.inherits (ol.HexGrid, ol.Object);

/** Layout
*/
ol.HexGrid.prototype.layout =
{	pointy: 
	[	Math.sqrt(3), Math.sqrt(3)/2, 0, 3/2, 
		Math.sqrt(3)/3, -1/3, 0, 2/3, 
		// corners
		Math.cos(Math.PI / 180 * (60 * 0 + 30)), Math.sin(Math.PI / 180 * (60 * 0 + 30)), 
		Math.cos(Math.PI / 180 * (60 * 1 + 30)), Math.sin(Math.PI / 180 * (60 * 1 + 30)), 
		Math.cos(Math.PI / 180 * (60 * 2 + 30)), Math.sin(Math.PI / 180 * (60 * 2 + 30)), 
		Math.cos(Math.PI / 180 * (60 * 3 + 30)), Math.sin(Math.PI / 180 * (60 * 3 + 30)), 
		Math.cos(Math.PI / 180 * (60 * 4 + 30)), Math.sin(Math.PI / 180 * (60 * 4 + 30)), 
		Math.cos(Math.PI / 180 * (60 * 5 + 30)), Math.sin(Math.PI / 180 * (60 * 5 + 30))
	],
	flat: 
	[	3/2, 0, Math.sqrt(3)/2, Math.sqrt(3), 2/3, 
		0, -1/3, Math.sqrt(3) / 3, 
		// corners
		Math.cos(Math.PI / 180 * (60 * 0)), Math.sin(Math.PI / 180 * (60 * 0)), 
		Math.cos(Math.PI / 180 * (60 * 1)), Math.sin(Math.PI / 180 * (60 * 1)), 
		Math.cos(Math.PI / 180 * (60 * 2)), Math.sin(Math.PI / 180 * (60 * 2)), 
		Math.cos(Math.PI / 180 * (60 * 3)), Math.sin(Math.PI / 180 * (60 * 3)), 
		Math.cos(Math.PI / 180 * (60 * 4)), Math.sin(Math.PI / 180 * (60 * 4)), 
		Math.cos(Math.PI / 180 * (60 * 5)), Math.sin(Math.PI / 180 * (60 * 5))
	]
};

/** Set layout
* @param {pointy | flat | undefined} layout name, default pointy
*/
ol.HexGrid.prototype.setLayout = function (layout)
{	this.layout_ = this.layout[layout] || this.layout.pointy;
	this.changed();
}

/** Get layout
* @return {pointy | flat} layout name
*/
ol.HexGrid.prototype.getLayout = function ()
{	return (this.layout_[9]!=0 ? 'pointy' : 'flat');
}

/** Set hexagon origin
* @param {ol.coordinate} coord origin
*/
ol.HexGrid.prototype.setOrigin = function (coord)
{	this.origin_ = coord;
	this.changed();
}

/** Get hexagon origin
* @return {ol.coordinate} coord origin
*/
ol.HexGrid.prototype.getOrigin = function (coord)
{	return this.origin_;
}

/** Set hexagon size
* @param {Number} hexagon size
*/
ol.HexGrid.prototype.setSize = function (s)
{	this.size_ = s || 80000;
	this.changed();
}

/** Get hexagon size
* @return {Number} hexagon size
*/
ol.HexGrid.prototype.getSize = function (s)
{	return this.size_;
}

/** Convert cube to axial coords
* @param {ol.coordinate} c cube coordinate
* @return {ol.coordinate} axial coordinate
*/
ol.HexGrid.prototype.cube2hex = function (c)
{	return [c[0], c[2]];
};

/** Convert axial to cube coords
* @param {ol.coordinate} h axial coordinate
* @return {ol.coordinate} cube coordinate
*/
ol.HexGrid.prototype.hex2cube = function(h)
{	return [h[0], -h[0]-h[1], h[1]];
};

/** Convert offset to axial coords
* @param {ol.coordinate} h axial coordinate
* @return {ol.coordinate} offset coordinate
*/
ol.HexGrid.prototype.hex2offset = function (h)
{	if (this.layout_[9]) return [ h[0] + (h[1] - (h[1]&1)) / 2, h[1] ];
	else return [ h[0], h[1] + (h[0] + (h[0]&1)) / 2 ];
}

/** Convert axial to offset coords
* @param {ol.coordinate} o offset coordinate
* @return {ol.coordinate} axial coordinate
*/
ol.HexGrid.prototype.offset2hex = function(o)
{	if (this.layout_[9]) return [ q = o[0] - (o[1] - (o[1]&1)) / 2,  r = o[1] ];
	else return [ o[0], o[1] - (o[0] + (o[0]&1)) / 2 ];
}

/** Convert offset to cube coords
* @param {ol.coordinate} c cube coordinate
* @return {ol.coordinate} offset coordinate
* /
ol.HexGrid.prototype.cube2offset = function(c)
{	return hex2offset(cube2hex(c));
};

/** Convert cube to offset coords
* @param {ol.coordinate} o offset coordinate
* @return {ol.coordinate} cube coordinate
* /
ol.HexGrid.prototype.offset2cube = function (o)
{	return hex2cube(offset2Hex(o));
};

/** Round cube coords
* @param {ol.coordinate} h cube coordinate
* @return {ol.coordinate} rounded cube coordinate
*/
ol.HexGrid.prototype.cube_round = function(h)
{	var rx = Math.round(h[0])
	var ry = Math.round(h[1])
	var rz = Math.round(h[2])

	var x_diff = Math.abs(rx - h[0])
	var y_diff = Math.abs(ry - h[1])
	var z_diff = Math.abs(rz - h[2])

	if (x_diff > y_diff && x_diff > z_diff) rx = -ry-rz
	else if (y_diff > z_diff) ry = -rx-rz
	else rz = -rx-ry

	return [rx, ry, rz];
};

/** Round axial coords
* @param {ol.coordinate} h axial coordinate
* @return {ol.coordinate} rounded axial coordinate
*/
ol.HexGrid.prototype.hex_round = function(h)
{	return this.cube2hex( this.cube_round( this.hex2cube(h )) );
};

/** Get hexagon corners
*/
ol.HexGrid.prototype.hex_corner = function(center, size, i)
{	return [ center[0] + size * this.layout_[8+(2*(i%6))], center[1] + size * this.layout_[9+(2*(i%6))]];
};

/** Get hexagon coordinates at a coordinate
* @param {ol.coord} coord
* @return {Arrary<ol.coord>}
*/
ol.HexGrid.prototype.getHexagonAtCoord = function (coord)
{	returhn (this.getHexagon(this.coord2hex(coord)));
};

/** Get hexagon coordinates at hex
* @param {ol.coord} hex
* @return {Arrary<ol.coord>}
*/
ol.HexGrid.prototype.getHexagon = function (hex)
{	var p = [];
	var c = this.hex2coord(hex);
	for (var i=0; i<=7; i++)
	{	p.push(this.hex_corner(c, this.size_, i, this.layout_[8]));
	}
	return p;
};

/** Convert hex to coord
* @param {ol.hex} hex 
* @return {ol.coord} 
*/
ol.HexGrid.prototype.hex2coord = function (hex)
{	return [
		this.origin_[0] + this.size_ * (this.layout_[0] * hex[0] + this.layout_[1] * hex[1]), 
		this.origin_[1] + this.size_ * (this.layout_[2] * hex[0] + this.layout_[3] * hex[1])
	];
};

/** Convert coord to hex
* @param {ol.coord} coord 
* @return {ol.hex} 
*/
ol.HexGrid.prototype.coord2hex = function (coord)
{	var c = [ (coord[0]-this.origin_[0]) / this.size_, (coord[1]-this.origin_[1]) / this.size_ ];
	var q = this.layout_[4] * c[0] + this.layout_[5] * c[1];
	var r = this.layout_[6] * c[0] + this.layout_[7] * c[1];
	return this.hex_round([q, r]);
};

/** Calculate distance between to hexagon (number of cube)
* @param {ol.coordinate} a first cube coord
* @param {ol.coordinate} a second cube coord
* @return {Number} distance
*/
ol.HexGrid.prototype.cube_distance = function (a, b)
{	//return ( (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])) / 2 );
	return ( Math.max (Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2])) );
};

(function(){
/** Line interpolation
*/
function lerp(a, b, t)
{	// for floats
    return a + (b - a) * t;
};
function cube_lerp(a, b, t)
{	// for hexes
    return [ 
		lerp (a[0]+1e-6, b[0], t), 
		lerp (a[1]+1e-6, b[1], t),
		lerp (a[2]+1e-6, b[2], t)
	];
};

/** Calculate line between to hexagon 
* @param {ol.coordinate} a first cube coord
* @param {ol.coordinate} b second cube coord
* @return {Array<ol.coordinate>} array of cube coordinates
*/
ol.HexGrid.prototype.cube_line = function (a, b)
{	var d = this.cube_distance(a, b);
	if (!d) return [a];
    var results = []
    for (var i=0; i<=d; i++) 
	{	results.push ( this.cube_round ( cube_lerp(a, b, i/d) ) );
	}
    return results;
};
})();


ol.HexGrid.prototype.neighbors = 
{	'cube':	[ [+1, -1,  0], [+1,  0, -1], [0, +1, -1], [-1, +1,  0], [-1,  0, +1], [0, -1, +1] ],
	'hex':	[ [+1, 0], [+1,  -1], [0, -1], [-1, 0], [-1, +1], [0, +1] ]
};

/** Get the neighbors for an hexagon
* @param {ol.coordinate} h axial coord
* @param {Number} direction 
* @return { ol.coordinate | Array<ol.coordinates> } neighbor || array of neighbors
*/
ol.HexGrid.prototype.hex_neighbors = function (h, d)
{	if (d!==undefined)
	{	return [ h[0] + this.neighbors.hex[d%6][0], h[1]  + this.neighbors.hex[d%6][1] ];
	}
	else
	{	var n = [];
		for (d=0; d<6; d++)
		{	n.push ([ h[0] + this.neighbors.hex[d][0], h[1]  + this.neighbors.hex[d][1] ]);
		}
		return n;
	}
};

/** Get the neighbors for an hexagon
* @param {ol.coordinate} c cube coord
* @param {Number} direction 
* @return { ol.coordinate | Array<ol.coordinates> } neighbor || array of neighbors
*/
ol.HexGrid.prototype.cube_neighbors = function (c, d)
{	if (d!==undefined)
	{	return [ c[0] + this.neighbors.cube[d%6][0], c[1]  + this.neighbors.cube[d%6][1], c[2]  + this.neighbors.cube[d%6][2] ];
	}
	else
	{	var n = [];
		for (d=0; d<6; d++)
		{	n.push ([ c[0] + this.neighbors.cube[d][0], c[1]  + this.neighbors.cube[d][1], c[2]  + this.neighbors.cube[d][2] ]);
		}
		for (d=0; d<6; d++) n[d] = this.cube2hex(n[d])
		return n;
	}
};
