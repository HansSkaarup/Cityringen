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
if (empty($_GET['adresse'])) {
    echo "missing required paramater: <i>adresse</i>";
    exit;
} else
    $adresse = $_GET['adresse'];

# Build SQL SELECT statement and return the geometry as a GeoJSON element in EPSG: 4326
$sql = "SELECT cur_id, st_asgeojson(geom, 4326) as geojson FROM current.samplepoint_vertice_comparison_curfur
ORDER BY geom <-> ST_SetSRID(ST_Point(" . $adresse . "),4326)
LIMIT 1";



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