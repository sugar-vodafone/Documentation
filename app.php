<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

require_once __DIR__.'/vendor/autoload.php';

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'dbs.options' => array (
        'localhost' => array(
            'driver'    => 'pdo_mysql',
            'host'      => 'localhost',
            'port'      => '3306',
            'dbname'    => 'vodafone_documentation',
            'user'      => 'root',
            'password'  => 'root',
            'charset'   => 'utf8',
        )
    ),
));

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$app->post('/selections', function (Request $request) use ($app) {
//    var_dump($request);

    $data = array(
        'lang' => $request->request->get('language'),
        'file' => $request->request->get('filename'),
        'serialized_range' => $request->get('serialized_range'),
        'body_html'  => $request->request->get('body_html'),
        'body_text'  => $request->request->get('body_text')
    );

    $selection_id = $app['db']->fetchColumn('SELECT id FROM selections WHERE (serialized_range = ? AND lang = ?) OR body_text = ?', array($data['serialized_range'], $data['lang'], $data['body_text']), 0);
//    var_dump($selection_id);

    if($selection_id) {
        $app['db']->delete('selections', array('id' => $selection_id));
        $data['status'] = "Removed";
        $statusCode = 200;
    }
    else {
        $app['db']->insert('selections', $data);
        $data['status'] = "Added";
        $statusCode = 201;
    }

    return $app->json($data, $statusCode);

});

$app->get('/selections', function (Request $request) use ($app) {
    $data = [];
    $filename = $request->get('filename');
    $language = $request->get('language');
//var_dump($language,$filename);

    $data = $app['db']->fetchAll('SELECT lang, file, serialized_range FROM selections WHERE lang = ? AND file = ?', array($language, $filename));
    //var_dump($data);

    return $app->json($data, 200);
});

$app->delete('/selections', function (Request $request) use ($app) {
//    var_dump($request);

    $selection_id = "";
    $app['db']->delete('selections', array('id' => $selection_id));
    $data['status'] = "Removed";
    $statusCode = 200;

    return $app->json($data, $statusCode);

});

//$app->post('/selections/download', function (Request $request) use ($app) {
//    $filename = $request->request->get('filename');
//    $language = $request->request->get('language');
//    $html = $request->get('html');
//
//// Output CSV-specific headers
//    header('Pragma: public');
//    header('Expires: 0');
//    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
//    header('Cache-Control: private', false);
//    header('Content-Type: application/octet-stream');
//    header('Content-Disposition: attachment; filename="' . $filename . '.html";');
//    header('Content-Transfer-Encoding: binary');
//
//// Stream the CSV data
//    exit($html);
//});


$app->run();