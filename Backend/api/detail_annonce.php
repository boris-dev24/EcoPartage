<?php
include '../config.php';

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de l\'annonce manquant']);
    exit;
}

$id = $_GET['id'];

$sql = "SELECT annonces.*, utilisateurs.nom AS utilisateur_nom 
        FROM annonces 
        JOIN utilisateurs ON annonces.utilisateur_id = utilisateurs.id 
        WHERE annonces.id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute(['id' => $id]);
$annonce = $stmt->fetch(PDO::FETCH_ASSOC);

if ($annonce) {
    echo json_encode(['success' => true, 'annonce' => $annonce]);
} else {
    echo json_encode(['success' => false, 'message' => 'Annonce non trouvée']);
}
?>