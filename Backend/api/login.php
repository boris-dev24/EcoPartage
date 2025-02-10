<?php
//API de connexion

include_once 'config.php';
include_once 'jwt.php'; 

// Récupérer les données envoyées via la méthode POST
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    // Vérifier si l'utilisateur existe dans la base de données
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Générer un token JWT (à personnaliser selon ton implementation JWT)
        $token = generateJWT($user['id']); // Assumes `generateJWT` génère un JWT valide
        
        echo json_encode(['message' => 'Connexion réussie', 'token' => $token]);
        http_response_code(200);
    } else {
        echo json_encode(['message' => 'Identifiants incorrects']);
        http_response_code(401);
    }
} else {
    echo json_encode(['message' => 'Tous les champs sont obligatoires']);
    http_response_code(400);
}
?>
