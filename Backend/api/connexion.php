<?php



include '../config.php';

// recuperer les donnees envoyees en json
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier si les données sont bien envoyées
if (empty($data['email']) || empty($data['motDePasse'])) {
    echo json_encode(['success' => false, 'message' => 'Email ou mot de passe manquant', 'user' => null]);
    exit;
}


// recuperer les champs formulaires
$email = $data['email'];
$motDePasse = $data['motDePasse'];

// Valider l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide', 'user' => null]);
    exit;
}

// Vérifier l'existence de l'email dans la base de données
$sql = "SELECT * FROM utilisateurs WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if ($user) {
    // Vérifier le mot de passe
    if (password_verify($motDePasse, $user['mot_de_passe'])) {
        session_start();
        session_regenerate_id(true); // Regénère l'ID de session pour plus de sécurité
        $_SESSION['user_id'] = $user['id'];

        // Renvoyer les informations utilisateur avec succès
        echo json_encode([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user['id'],
                'nom' => $user['nom'],  // Ajuste selon le nom de la colonne dans ta base
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Identifiants incorrects', 'user' => null]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Identifiants incorrects', 'user' => null]);
}

?>