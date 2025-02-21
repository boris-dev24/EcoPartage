<?php
include '../config.php';

// Récupérer les paramètres de la requête GET
$categorie = isset($_GET['categorie']) ? $_GET['categorie'] : null;
$localisation = isset($_GET['localisation']) ? $_GET['localisation'] : null;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1; // Page actuelle
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10; // Nombre d'annonces par page

// Calculer l'offset pour la pagination
$offset = ($page - 1) * $limit;

// Construire la requête SQL en fonction des filtres
$sql = "SELECT annonces.*, utilisateurs.nom AS utilisateur_nom 
        FROM annonces 
        JOIN utilisateurs ON annonces.utilisateur_id = utilisateurs.id";

$conditions = [];
$params = [];

if ($categorie) {
    $conditions[] = "annonces.categorie = :categorie";
    $params['categorie'] = $categorie;
}

if ($localisation) {
    $conditions[] = "annonces.localisation LIKE :localisation";
    $params['localisation'] = "%$localisation%"; // Recherche partielle
}

if (count($conditions) > 0) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

// Ajouter la pagination à la requête
$sql .= " ORDER BY annonces.date_creation DESC LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);

// Ajouter les paramètres de pagination
$params['limit'] = $limit;
$params['offset'] = $offset;

// Exécuter la requête
foreach ($params as $key => $value) {
    $stmt->bindValue(":$key", $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
}
$stmt->execute();

$annonces = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Récupérer le nombre total d'annonces pour la pagination
$sqlCount = "SELECT COUNT(*) AS total FROM annonces";
if (count($conditions) > 0) {
    $sqlCount .= " WHERE " . implode(" AND ", $conditions);
}
$stmtCount = $pdo->prepare($sqlCount);
$stmtCount->execute($params);
$totalAnnonces = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode([
    'success' => true,
    'annonces' => $annonces,
    'total' => $totalAnnonces,
    'page' => $page,
    'limit' => $limit
]);
?>