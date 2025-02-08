<?php
header("Access-Control-Allow-Origin: *"); // Permet à tous les domaines d'accéder à l'API
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = [
        'message' => 'Hello from the PHP backend!',
        'status' => 'success'
    ];
    echo json_encode($data);
}
