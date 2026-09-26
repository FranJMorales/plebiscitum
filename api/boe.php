<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$url = 'https://www.boe.es/rss/canal.php?c=ultimo';

// Create a stream context to send a User-Agent, as BOE might block requests without it.
$options = [
    'http' => [
        'method' => "GET",
        'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n"
    ]
];
$context = stream_context_create($options);

$result = @file_get_contents($url, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch RSS from BOE']);
    exit;
}

$xml = @simplexml_load_string($result);
if ($xml === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse BOE XML']);
    exit;
}

$items = [];
foreach ($xml->channel->item as $item) {
    $items[] = [
        'title' => (string)$item->title,
        'link' => (string)$item->link,
        'date' => (string)$item->pubDate
    ];
}

// Slice to 30 items
echo json_encode(array_slice($items, 0, 30));
?>
