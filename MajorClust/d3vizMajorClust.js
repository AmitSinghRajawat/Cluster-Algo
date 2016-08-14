function visual(adjacencyList, clean) {

    var fill = d3.scale.category10();

    var nodes = d3.values(adjacencyList),
        links = d3.merge(nodes.map(function(source) {
            return source.map(function(target) {
                return {
                    source: source,
                    target: adjacencyList[target]
                };
            });
        }));

    var w = 1000,
        h = 1000;

    var vis = d3.select("#viz").append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .gravity(0.05)
        .size([w, h])
        .start()
        .on("tick", tick);

    function tick(e) {
        var k = .1 * e.alpha;

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.id].y - o.y) * k;
            o.x += (foci[o.id].x - o.x) * k;
        });

        node
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    }

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d, i) {
            tooltip = "";
            for (var k in tokens[i]) {
                tooltip += " " + Object.keys(tokens[i][k]).toString();
            }
            return "<strong>Document content:</strong> <span style='color:red'>" + tooltip + "</span>";
        });

    vis.call(tip);

    var link = vis.selectAll("line.link")
        .data(links)

    .enter().append("svg:line");

    var node = vis.selectAll("circle.node")
        .data(nodes)
        .enter().append("svg:circle")
        .attr("r", 10)
        .style("fill", function(d, i) {

            return fill(clean[i]);
        })
        .call(force.drag)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)


    force.on("tick", function() {
        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    });
}
