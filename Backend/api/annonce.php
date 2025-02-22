<?php
session_start();
include '../config.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

// Vérifier si des fichiers images ont été uploadés
if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
    echo json_encode(['success' => false, 'message' => 'Veuillez uploader au moins une image']);
    exit;
}

// Récupérer les données du formulaire
$titre = $_POST['titre'];
$description = $_POST['description'];
$categorie = $_POST['categorie'];
$localisation = $_POST['localisation'];
$utilisateur_id = $_SESSION['user_id'];

// Validation des images
$maxFileSize = 5 * 1024 * 1024; // 5 Mo
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$uploadDir = '../uploads/'; // Dossier où les images seront stockées

foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
    $fileName = $_FILES['images']['name'][$index];
    $fileSize = $_FILES['images']['size'][$index];
    $fileType = $_FILES['images']['type'][$index];

    // Vérifier la taille du fichier
    if ($fileSize > $maxFileSize) {
        echo json_encode(['success' => false, 'message' => "La taille du fichier $fileName ne doit pas dépasser 5 Mo"]);
        exit;
    }

    // Vérifier le type de fichier
    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => "Seuls les fichiers JPEG, PNG et GIF sont autorisés ($fileName)"]);
        exit;
    }
}

// Insérer l'annonce dans la base de données
$sql = "INSERT INTO annonces (titre, description, categorie, localisation, utilisateur_id) 
        VALUES (:titre, :description, :categorie, :localisation, :utilisateur_id)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'titre' => $titre,
    'description' => $description,
    'categorie' => $categorie,
    'localisation' => $localisation,
    'utilisateur_id' => $utilisateur_id
]);

$annonce_id = $pdo->lastInsertId(); // Récupérer l'ID de l'annonce créée

// Enregistrer les images dans la table annonce_images
foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
    $fileName = basename($_FILES['images']['name'][$index]);
    $uploadFile = $uploadDir . $fileName;

    if (move_uploaded_file($tmpName, $uploadFile)) {
        $sql = "INSERT INTO annonce_images (annonce_id, image_path) VALUES (:annonce_id, :image_path)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'annonce_id' => $annonce_id,
            'image_path' => $uploadFile
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => "Erreur lors de l'upload de l'image $fileName"]);
        exit;
    }
}

echo json_encode(['success' => true, 'message' => 'Annonce publiée avec succès']);
?>