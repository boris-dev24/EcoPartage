<?php
//API pour gérer les annonces

include_once 'config.php';
include_once 'jwt.php';

function checkAuth() {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        return validateJWT($token);
    } else {
        return false;
    }
}

// Récupérer les données envoyées via la méthode POST
$data = json_decode(file_get_contents('php://input'), true);

// API pour ajouter une annonce
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($userId = checkAuth()) {  // Vérifier si l'utilisateur est authentifié
        if (isset($data['title']) && isset($data['description'])) {
            $title = $data['title'];
            $description = $data['description'];
            
            // Insérer l'annonce dans la base de données
            $stmt = $pdo->prepare("INSERT INTO annonces (title, description, user_id) VALUES (?, ?, ?)");
            if ($stmt->execute([$title, $description, $userId])) {
                echo json_encode(['message' => 'Annonce ajoutée']);
                http_response_code(201);
            } else {
                echo json_encode(['message' => 'Erreur lors de l\'ajout de l\'annonce']);
                http_response_code(500);
            }
        } else {
            echo json_encode(['message' => 'Le titre et la description sont obligatoires']);
            http_response_code(400);
        }
    } else {
        echo json_encode(['message' => 'Non autorisé']);
        http_response_code(401);
    }
}

// API pour récupérer toutes les annonces
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM annonces");
    $stmt->execute();
    $annonces = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($annonces);
    http_response_code(200);
}

// API pour supprimer une annonce
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if ($userId = checkAuth()) {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];

        // Vérifier si l'annonce existe
        $stmt = $pdo->prepare("SELECT * FROM annonces WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $annonce = $stmt->fetch();

        if ($annonce) {
            $stmt = $pdo->prepare("DELETE FROM annonces WHERE id = ?");
            if ($stmt->execute([$id])) {
                echo json_encode(['message' => 'Annonce supprimée']);
                http_response_code(200);
            } else {
                echo json_encode(['message' => 'Erreur lors de la suppression']);
                http_response_code(500);
            }
        } else {
            echo json_encode(['message' => 'Annonce non trouvée ou non autorisée']);
            http_response_code(404);
        }
    } else {
        echo json_encode(['message' => 'Non autorisé']);
        http_response_code(401);
    }
}
?>
