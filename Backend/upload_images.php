<?php
// Permettre l'accès depuis localhost:3000 (React app)
header("Access-Control-Allow-Origin: http://localhost:8000");
// Permettre certains types de méthodes HTTP
header("Access-Control-Allow-Methods: POST, OPTIONS");
// Permettre certains types d'en-têtes
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');  // Définir le type de contenu comme JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Répondre avec une réponse vide pour les requêtes OPTIONS (pré-vol CORS)
    exit(0);
}

// Connexion à la base de données
$servername = "localhost";  // Serveur MySQL
$username = "root";         // Nom d'utilisateur MySQL (par défaut : root)
$password = "mysql";        // Mot de passe MySQL (par défaut : vide)
$dbname = "ecopartage";     // Nom de la base de données

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'La connexion a échoué : ' . $conn->connect_error]);
    exit();
}

// Vérification si des fichiers ont été envoyés
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['images'])) {
    $annonce_id = $_POST['annonce_id'];  // Récupérer l'ID de l'annonce
    $upload_dir = "uploads/";  // Dossier pour stocker les images

    // Vérifier si le dossier existe sinon le créer
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Récupérer les fichiers envoyés
    $images = $_FILES['images'];

    // Types d'extensions d'images autorisés
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
    $response = [];

    // Parcourir les fichiers et les enregistrer
    foreach ($images['tmp_name'] as $key => $tmp_name) {
        $file_name = basename($images['name'][$key]);
        $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        // Vérifier l'extension du fichier
        if (!in_array($file_extension, $allowed_extensions)) {
            $response[] = ['status' => 'error', 'message' => "Erreur : L'extension du fichier '$file_name' n'est pas autorisée."];
            continue;
        }

        // Vérifier la taille du fichier (exemple : ne pas dépasser 5MB)
        if ($images['size'][$key] > 5 * 1024 * 1024) {
            $response[] = ['status' => 'error', 'message' => "Erreur : Le fichier '$file_name' dépasse la taille autorisée (5MB)."];
            continue;
        }

        // Définir le chemin d'upload
        $target_path = $upload_dir . $file_name;

       // Déplacer le fichier dans le dossier d'upload
       if (move_uploaded_file($tmp_name, $target_path)) {
        // Insérer l'URL de l'image dans la base de données avec une requête préparée pour éviter les injections SQL
        $stmt = $conn->prepare("INSERT INTO images (annonce_id, image_path) VALUES (?, ?)");
        $stmt->bind_param("is", $annonce_id, $target_path);

        if ($stmt->execute()) {
            $response[] = ['status' => 'success', 'message' => "L'image '$file_name' a été téléchargée et enregistrée avec succès."];
        } else {
            $response[] = ['status' => 'error', 'message' => "Erreur lors de l'insertion dans la base de données pour l'image '$file_name': " . $stmt->error];
        }

        $stmt->close();
    } else {
        $response[] = ['status' => 'error', 'message' => "Erreur lors du téléchargement de l'image '$file_name'."];
    }
}

// Si tout se passe bien, renvoyer une réponse JSON
echo json_encode($response);
} else {
// Si aucun fichier n'a été envoyé, renvoyer une erreur
echo json_encode(['status' => 'error', 'message' => 'Aucun fichier envoyé.']);
}

$conn->close();
?>
