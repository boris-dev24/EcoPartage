<?php
//API d'inscription

// Inclure la logique pour se connecter à la base de données
include_once 'config.php';

// Récupérer les données envoyées via la méthode POST
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email']) && isset($data['password']) && isset($data['name'])) {
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT); // Hachage du mot de passe
    $name = $data['name'];

    // Vérifier si l'email existe déjà dans la base de données
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode(['message' => 'Email déjà utilisé']);
        http_response_code(400);
    } else {
        // Insérer l'utilisateur dans la base de données
        $stmt = $pdo->prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
        if ($stmt->execute([$email, $password, $name])) {
            echo json_encode(['message' => 'Inscription réussie']);
            http_response_code(201);
        } else {
            echo json_encode(['message' => 'Erreur lors de l\'inscription']);
            http_response_code(500);
        }
    }
} else {
    echo json_encode(['message' => 'Tous les champs sont obligatoires']);
    http_response_code(400);
}
?>
