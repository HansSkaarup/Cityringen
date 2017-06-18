<?php
set_time_limit(300);
function escapeJsonString($value) { # list from www.json.org: (\b backspace, \f formfeed)
  $escapers = array("\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c");
  $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b");
  $result = str_replace($escapers, $replacements, $value);
  return $result;
}
 

# Connect to PostgreSQL database
$conn = pg_connect("dbname='cph_network1' user='postgres' password='postgres' host='localhost'");
if (!$conn) {
    echo "Not connected : " . pg_error();
    exit;
}
# If no input to adress, echo error message. Otherwise continue and set variable adress = input from GET function.
if (empty($_GET['vertice'])) {
    echo "missing required paramater: <i>vertice</i>";
    exit;
} else
    $vertice = $_GET['vertice'];

# Build SQL SELECT statement and return the geometry as a GeoJSON element in EPSG: 4326
$sql = "With i as(SELECT DISTINCT ON (end_vid) *, agg_cost/60 as cost_m, future.samplepoint_vertice_comparison.geom as pointgeom
FROM future.samplepoint_vertice_comparison,
pgr_dijkstra('SELECT pk as id, source, target, costs as cost, reverse_costs as reverse_cost FROM future.merged_ways'," . $vertice . ", (select array_agg(id::integer) as array
from future.samplepoint_vertice_comparison), TRUE)
where future.samplepoint_vertice_comparison.id = end_vid order by end_vid, agg_cost desc)
SELECT cost_m, st_asgeojson(grid2.geom, 4326) as geojson from i, grid2 where st_intersects(i.pointgeom, grid2.geom)";



# Try query or error
$rs = pg_query($conn, $sql);
if (!$rs) {
    echo "An SQL error occured.\n";
    exit;
}

# Build GeoJSON
$output    = '';
$rowOutput = '';

while ($row = pg_fetch_assoc($rs)) {
    $rowOutput = (strlen($rowOutput) > 0 ? ',' : '') . '{"type": "Feature", "geometry": ' . $row['geojson'] . ', "properties": {';
    $props = '';
    $id    = '';
    foreach ($row as $key => $val) {
        if ($key != "geojson") {
            $props .= (strlen($props) > 0 ? ',' : '') . '"' . $key . '":"' . escapeJsonString($val) . '"';
        }
        if ($key == "id") {
            $id .= ',"id":"' . escapeJsonString($val) . '"';
        }
    }
    
    $rowOutput .= $props . '}';
    $rowOutput .= $id;
    $rowOutput .= '}';
    $output .= $rowOutput;
}

$output = '{ "type": "FeatureCollection", "features": [ ' . $output . ' ]}';
echo $output;
?>