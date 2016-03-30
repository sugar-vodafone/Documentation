<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

require_once __DIR__.'/vendor/autoload.php';
require_once __DIR__.'/config.php';

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => $config['db_options']
));

//$app->register(new Silex\Provider\SecurityServiceProvider(), array(
//    'security.firewalls' => array(
//        'api' => array(
//            'pattern' => '^/',
//            'http' => true,
//            'users' => array(
//                // raw password is foo
//                'admin' => array('ROLE_ADMIN', '5FZ2Z8QIkA7UTZ4BYkoC+GsReLf569mSKDsfods6LYQ8t+a8EW9oaircfMpmaLbPBh4FOBiiFyLfuZmTSUwzZg=='),
//            )
//        )
//    )
//));

//$app->before(function (Request $request) {
//    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
//        $data = json_decode($request->getContent(), true);
//        $request->request->replace(is_array($data) ? $data : array());
//    }
//});

$app->get('/api/login', function(Request $request) use ($app) {
    return $app['twig']->render('login.html', array(
        'error'         => $app['security.last_error']($request),
        'last_username' => $app['session']->get('_security.last_username'),
    ));
});

$app->post('/api/selections', function (Request $request) use ($app) {
//    var_dump($request);

    $params = array(
        'lang' => $request->request->get('language'),
        'file' => $request->request->get('filename'),
        'serialized_range' => $request->get('serialized_range'),
        'body_html'  => stripcslashes($request->request->get('body_html')),
        'body_text'  => $request->request->get('body_text')
    );

    try {
        $selection_id = $app['db']->fetchColumn('SELECT id FROM selections WHERE (serialized_range = ? AND lang = ?) OR body_text = ?', array($params['serialized_range'], $params['lang'], $params['body_text']), 0);
    //    var_dump($selection_id);

        if($selection_id) {
            $app['db']->delete('selections', array('id' => $selection_id));
            $response = array(
                'id' => $app['db']->lastInsertId(),
                'serialized_range' => $params['serialized_range'],
                'status' => 'Removed'
            );
            $statusCode = 200;
        }
        else {
            $app['db']->insert('selections', $params);
            $response = array(
                'id' => $app['db']->lastInsertId(),
                'serialized_range' => $params['serialized_range'],
                'status' => 'Added'
            );
            $statusCode = 201;
        }
    } catch (\PDOException $e) {
        $response = array(
            'err' => $e->getMessage()
        );
        $statusCode = 400;
    }

    return $app->json($response, $statusCode);
});

$app->get('/api/selections', function (Request $request) use ($app) {//var_dump($_SERVER);
    $data = array();
    $params = array(
        'lang' => $request->get('language'),
        'file' => $request->get('filename'),
        'range' => $request->get('serialized_range')
    );
    //var_dump($params);

    if(!empty($params['range']))
        $data = $app['db']->fetchAll('SELECT id, lang, file, serialized_range, body_text, body_html FROM selections WHERE serialized_range = ? AND deleted = 0', array($params['range']));
    elseif(!empty($params['lang']) && !empty($params['file']))
        $data = $app['db']->fetchAll('SELECT id, lang, file, serialized_range, body_text, body_html FROM selections WHERE lang = ? AND file = ? AND deleted = 0', array($params['lang'], $params['file']));
    elseif(empty($params['lang']) && !empty($params['file']))
        $data = $app['db']->fetchAll('SELECT id, lang, file, serialized_range, body_text, body_html FROM selections WHERE file = ? AND deleted = 0', array($params['file']));
    elseif(!empty($params['lang']) && empty($params['file']))
        $data = $app['db']->fetchAll('SELECT id, lang, file, serialized_range, body_text, body_html FROM selections WHERE lang = ? AND deleted = 0', array($params['lang']));
    else
        $data = $app['db']->fetchAll('SELECT id, lang, file, serialized_range, body_text, body_html FROM selections');

    //var_dump($data);

    return $app->json($data, 200);
});

//$app->get('/document', function (Request $request) use ($app) {//var_dump($_SERVER);
//    $params = array(
//        'lang' => $request->get('language'),
//        'file' => $request->get('filename')
//    );
//
//    $file = file_get_contents($params['lang'] . "/" . $params['file'] . ".html");
//    return $app->json($file, 200);
//});

$app->delete('/api/selections/{id}', function (Request $request, $id) use ($app) {
    $data = $app['db']->fetchAssoc('SELECT * FROM selections WHERE id = ?', array($id));
    if($data['deleted']) {
        $data = array('msg' => 'There is no selection with the ID ('.$id.') in the database');
        $statusCode = 404;
    }
    else {
        $app['db']->update('selections', array('deleted' => 1), array('id' => $id));
        $statusCode = 200;
    }

    return $app->json($data, $statusCode);

});

$app->get('/api/selections/document/download', function (Request $request) use ($app) {
    $params = array(
        'lang' => $request->get('language'),
        'file' => $request->get('filename')
    );

    if(!empty($params['lang']) && !empty($params['file'])) {
        $contents = file_get_contents($params['lang'] . "/" . $params['file'] . ".html");
        $selections = $app['db']->fetchAll('SELECT body_html FROM selections WHERE lang = ? AND file = ? AND deleted = 0', array($params['lang'], $params['file']));

        $updatedContents = applySelectionsToDocument($selections, $contents);

        header('Pragma: public');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Cache-Control: private', false);
        header('Content-Type: text/html');
        header('Content-Disposition: attachment; filename="' . $params['file'] . '.html";');
        //    header('Content-Transfer-Encoding: binary');

        // Stream the CSV data
        exit($updatedContents);
    }
});

$app->get('/api/selections/document', function (Request $request) use ($app) {
    $params = array(
        'lang' => $request->get('language'),
        'file' => $request->get('filename')
    );

    if(!empty($params['lang']) && !empty($params['file'])) {
        $contents = file_get_contents($params['lang'] . "/" . $params['file'] . ".html");
        $selections = $app['db']->fetchAll('SELECT body_html FROM selections WHERE lang = ? AND file = ? AND deleted = 0', array($params['lang'], $params['file']));

        $updatedContents = applySelectionsToDocument($selections, $contents);

        return $updatedContents;
    }
});

$app->post('/api/stream', function (Request $request) use ($app) {
    $params = array(
        'lang' => $request->get('language'),
        'file' => $request->get('filename'),
        'contents' => $request->get('contents')
    );

    header('Pragma: public');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Cache-Control: private', false);
    header('Content-Type: text/html');
    header('Content-Disposition: attachment; filename="' . $params['file'] . '.html";');
    //    header('Content-Transfer-Encoding: binary');

    // Stream the CSV data
    exit($params['contents']);
});

function applySelectionsToDocument($selections, $contents) {
    $search = array(
        '/\>[^\S ]+/s',  // strip whitespaces after tags, except space
        '/[^\S ]+\</s',  // strip whitespaces before tags, except space
        '/(\s)+/s',       // shorten multiple whitespace sequences
        '/\s\/\>/',
        '/SugarCRM/',
        '/Sugar/'
    );

    $replace = array(
        '>',
        '<',
        '\\1',
        '>',
        'VodafoneCRM',
        'VodafoneCRM'
    );

    $contents = preg_replace($search, $replace, $contents);

    for ($i = 0; $i < count($selections); $i++) {
        $body_html = preg_replace($search, $replace, $selections[$i]['body_html']);
        $contents = str_replace($body_html, "", $contents);
    }

    return $contents;
}


$app->run();