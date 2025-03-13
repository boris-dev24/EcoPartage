<?php
header('Content-Type: application/json');

// Connexion à la base de données
$host = 'localhost';
$dbname = 'ecopartage';
$username = 'root'; // Utilisateur par défaut d'AMPPS
$password = 'mysql'; // Mot de passe par défaut d'AMPPS

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit;
}

// Vérifier si des fichiers ont été envoyés
if (!isset($_FILES['images'])) {
    echo json_encode(['success' => false, 'message' => 'Aucun fichier reçu']);
    exit;
}

// Récupérer l'ID de l'annonce (envoyé depuis React)
$annonce_id = $_POST['annonce_id'];

// Dossier de stockage des images
$uploadDir = 'uploads/annonces/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true); // Crée le dossier s'il n'existe pas
}

$uploadedFiles = [];

// Traiter chaque fichier
foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
    $fileName = basename($_FILES['images']['name'][$key]);
    $filePath = $uploadDir . uniqid() . '_' . $fileName; // Nom unique pour éviter les conflits

    // Déplacer le fichier vers le dossier de stockage
    if (move_uploaded_file($tmp_name, $filePath)) {
        // Enregistrer le chemin dans la base de données
        $stmt = $pdo->prepare("INSERT INTO annonce_images (annonce_id, image_path) VALUES (:annonce_id, :image_path)");
        $stmt->execute([
            ':annonce_id' => $annonce_id,
            ':image_path' => $filePath
        ]);

        $uploadedFiles[] = $filePath;
    }
}

// Réponse JSON
echo json_encode(['success' => true, 'files' => $uploadedFiles]);