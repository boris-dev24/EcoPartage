<?php
include '../config.php';

// Récupérer toutes les annonces
$sql = "SELECT annonces.*, utilisateurs.nom AS utilisateur_nom, 
               GROUP_CONCAT(annonce_images.image_path) AS images 
        FROM annonces 
        JOIN utilisateurs ON annonces.utilisateur_id = utilisateurs.id 
        LEFT JOIN annonce_images ON annonces.id = annonce_images.annonce_id 
        GROUP BY annonces.id 
        ORDER BY annonces.date_creation DESC";
$stmt = $pdo->query($sql);
$annonces = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'annonces' => $annonces]);
?>