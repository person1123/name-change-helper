/*
 * FROM HERE::
 * https://gist.github.com/alojzije/11127839
 */

 import $ from 'jquery'

const GUTTER_WIDTH = 80;
const COLUMN_WIDTH = 350;
const PATH_WIDTH = 12;
const PATH_SPACING = 1.5 * PATH_WIDTH;

//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}

function drawPath(svg, path, startX, startY, endX, endY, gutterCounts) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    var stroke =  parseFloat(path.attr("stroke-width"));
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  startY + stroke)        svg.attr("height", startY + stroke);
    if (svg.attr("height") <  endY + stroke)          svg.attr("height", endY + stroke);
    if (svg.attr("width" ) < (endX) )                 svg.attr("width", (endX));
    
    var deltaX = Math.min(30, (endX - startX) * 0.15);
    var deltaY = Math.min(30, Math.abs((endY - startY) * 0.15))
        * (endY > startY ? 1 : -1);
    // // for further calculations which ever is the shortest distance
    var delta  =  deltaX < absolute(deltaY) ? deltaX : absolute(deltaY);

    // set sweep-flag (counter/clock-wise)
    // if start element is closer to the left edge,
    // draw the first arc counter-clockwise, and the second one clock-wise
    var arc1 = 0; var arc2 = 1;
    if (startY < endY) {
        arc1 = 1;
        arc2 = 0;
    }

    // Shift right by half a gutter so that each colum
    // includes the gutter to the left of it
    const firstGutter = Math.floor((startX + GUTTER_WIDTH / 2) / (COLUMN_WIDTH + GUTTER_WIDTH));
    const lastGutter = Math.floor((endX + GUTTER_WIDTH / 2) / (COLUMN_WIDTH + GUTTER_WIDTH));
 
    if (gutterCounts.length < Math.max(firstGutter, lastGutter) + 1) {
        for (let i = gutterCounts.length;
            i < Math.max(firstGutter, lastGutter) + 1;
            i++) {
            gutterCounts[i] = 0;
        }
    }
    gutterCounts[firstGutter]++;
    if (lastGutter !== firstGutter) {
        gutterCounts[lastGutter]++;
    }

    console.log(gutterCounts);

    const riseX = PATH_SPACING * gutterCounts[firstGutter] + firstGutter * (COLUMN_WIDTH + GUTTER_WIDTH) - GUTTER_WIDTH *.75;
    const fallX = PATH_SPACING * gutterCounts[lastGutter] + lastGutter * (COLUMN_WIDTH + GUTTER_WIDTH) - GUTTER_WIDTH *.75;

    console.log('startX: ' + startX + ' endX: ' + endX +
        ' fg: ' + firstGutter + ' lg: ' + lastGutter + ' rx: ' + riseX + ' fx: ' + fallX);

    if (lastGutter !== firstGutter) {
        // draw tha pipe-like path
        // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
        path.attr("d",  "M"  + startX + " " + startY +
        " H" + (riseX - delta) +
        " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (riseX) + " " + (startY+ delta*signum(deltaY)) +
        " V" + (30) +
        " H" + (fallX) +
        " V" + (endY + delta*signum(deltaY)) + 
        " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (fallX + delta) + " " + (endY) +
        " H" + endX );
    } else {
        // draw tha pipe-like path
        // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
        path.attr("d",  "M"  + startX + " " + startY +
        " H" + (riseX - delta) +
        " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (riseX) + " " + (startY+ delta*signum(deltaY)) +
        " V" + (endY - delta*signum(deltaY)) + 
        " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + (riseX + delta) + " " + (endY) +
        " H" + endX );
    }
}

var svgDrawCounter = 0;
function connectElements(svgContainer, svg, path, startElem, endElem, gutterCounts, startCounts, endCounts) {
    // if first element is further rigth than the second, swap!
    if(startElem.offset().left > endElem.offset().left){
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container   
    var svgTop  = svgContainer.offset().top;
    var svgLeft = svgContainer.offset().left;

    // get (top, left) coordinates for the two elements
    var startCoord = startElem.offset();
    var endCoord   = endElem.offset();

    const tweakWeight = 0.2;
    // const tweak = (endCoord.top - startCoord.top) / svgContainer.outerHeight();
    const tweak = 0;

    if (startElem.data('svgDrawCount') === undefined) {
        startElem.data('svgDrawCount', svgDrawCounter);
        svgDrawCounter++;
    }
    if (endElem.data('svgDrawCount') === undefined) {
        endElem.data('svgDrawCount', svgDrawCounter);
        svgDrawCounter++;
    }

    if (startCounts[startElem.data('svgDrawCount')] === undefined) {
        startCounts[startElem.data('svgDrawCount')] = 0;
    } else {
        startCounts[startElem.data('svgDrawCount')]++;
    }
    if (endCounts[endElem.data('svgDrawCount')] === undefined) {
        endCounts[endElem.data('svgDrawCount')] = 0;
    } else {
        endCounts[endElem.data('svgDrawCount')]++;
    }

    const startCount = startCounts[startElem.data('svgDrawCount')];
    const endCount = endCounts[endElem.data('svgDrawCount')];

    // calculate path's start (x,y)  coords
    // we want the x coordinate to visually result in the element's mid point
    var startX = startCoord.left + startElem.outerWidth() - svgLeft;    // x = left offset + width - svg's left offset
    var startY = startCoord.top  + PATH_SPACING * startCount + (0.5 + tweakWeight * tweak)*startElem.outerHeight() - svgTop;        // y = top offset + 0.5*height - svg's top offset

        // calculate path's end (x,y) coords
    var endX = endCoord.left - svgLeft;
    var endY = endCoord.top + PATH_SPACING * endCount + (0.5 - tweakWeight * tweak)*endElem.outerHeight()  - svgTop;

    if (Math.abs(startY - endY) <  60) {
        endY = startY;
    }

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY, gutterCounts);

}


class SVGDraw {
    connections = [];
    svg;
    gutterCounts = [];
    startCounts = {};
    endCounts = {};

    connect(path, node1, node2) {
        this.connections.push({path, node1, node2});

        if (this.svg && this.svgContainer) {
            this.reset();
        }
    }

    connectAll() {
        this.gutterCounts = [];
        this.startCounts = {};
        this.endCounts = {};
        this.connections.forEach(
            (connection, index) => 
                connectElements(
                    $(this.svgContainer),
                    $(this.svg),
                    $(connection.path),
                    $(connection.node1),
                    $(connection.node2),
                    this.gutterCounts,
                    this.startCounts,
                    this.endCounts
                )
        );
    }

    setUp(newSVG, newSVGContainer) {
        this.svg = newSVG;
        this.svgContainer = newSVGContainer;

        this.reset();
        $(window).resize(this.reset.bind(this));
    }

    reset() {
        // reset svg each time 
        $(this.svg).attr("height", "0");
        $(this.svg).attr("width", "0");
        this.connectAll();
    }
}

export default SVGDraw;