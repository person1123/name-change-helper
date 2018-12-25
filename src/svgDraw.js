/*
 * FROM HERE::
 * https://gist.github.com/alojzije/11127839
 */

 import $ from 'jquery'

//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}

function drawPath(svg, path, startX, startY, endX, endY) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    var stroke =  parseFloat(path.attr("stroke-width"));
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  startY + stroke)        svg.attr("height", startY + stroke);
    if (svg.attr("height") <  endY + stroke)          svg.attr("height", endY + stroke);
    if (svg.attr("width" ) < (endX) )                 svg.attr("width", (endX));
    
    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    // for further calculations which ever is the shortest distance
    var delta  =  deltaX < absolute(deltaY) ? deltaX : absolute(deltaY);

    // set sweep-flag (counter/clock-wise)
    // if start element is closer to the left edge,
    // draw the first arc counter-clockwise, and the second one clock-wise
    var arc1 = 0; var arc2 = 1;
    if (startY < endY) {
        arc1 = 1;
        arc2 = 0;
    }
    // draw tha pipe-like path
    // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
    // path.attr("d",  "M"  + startX + " " + startY +
    //                 " V" + (startY + delta) +
    //                 " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
    //                 " H" + (endX - delta*signum(deltaX)) + 
    //                 " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
    //                 " V" + endY );

    path.attr("d",  "M"  + startX + " " + startY +
    " H" + (startX + delta) +
    " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + 2*delta) + " " + (startY+ delta*signum(deltaY)) +
    " V" + (endY - delta*signum(deltaY)) + 
    " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + (startX + 3*delta) + " " + (endY) +
    " H" + endX );
}

function connectElements(svgContainer, svg, path, startElem, endElem) {
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
    const tweak = (endCoord.top - startCoord.top) / svgContainer.outerHeight();

    // calculate path's start (x,y)  coords
    // we want the x coordinate to visually result in the element's mid point
    var startX = startCoord.left + startElem.outerWidth() - svgLeft;    // x = left offset + width - svg's left offset
    var startY = startCoord.top  + (0.5 + tweakWeight * tweak)*startElem.outerHeight() - svgTop;        // y = top offset + 0.5*height - svg's top offset

        // calculate path's end (x,y) coords
    var endX = endCoord.left - svgLeft;
    var endY = endCoord.top + (0.5 - tweakWeight * tweak)*endElem.outerHeight()  - svgTop;

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);

}


class SVGDraw {
    connections = [];
    svg;

    connect(path, node1, node2) {
        this.connections.push({path, node1, node2});

        if (this.svg && this.svgContainer) {
            this.reset();
        }
    }

    connectAll() {
        console.log(this.connections);
        this.connections.forEach(
            connection => 
                connectElements(
                    $(this.svgContainer),
                    $(this.svg),
                    $(connection.path),
                    $(connection.node1),
                    $(connection.node2)
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