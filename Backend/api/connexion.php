<?php



include '../config.php';

// recuperer les donnees envoyees en json
$data = json_decode(file_get_contents('php://input'), true);

// vérifier si les données sont bien envoyées
if (empty($data['email']) || empty($data['motDePasse'])) {
    echo json_encode(['success' => false, 'message' => 'Email ou mot de passe manquant']);
    exit;
}


// recuperer les champs formulaires
$email = $data['email'];
$motDePasse = $data['motDePasse'];

// verifie l'existence de l'email dans la bd
$sql = "SELECT * FROM utilisateurs WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

// verification du mot de passe

// try {
//     $stmt->execute(['email' => $email]);
//     $user = $stmt->fetch();
    
//     if ($user && password_verify($motDePasse, $user['mot_de_passe'])) {
//         session_start();
//         $_SESSION['user_id'] = $user['id'];  // Enregistrer l'identifiant de l'utilisateur dans la session
//         echo json_encode(['success' => true, 'message' => 'Connexion réussie']);
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
//     }
// } catch (PDOException $e) {
//     echo json_encode(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()]);
// }



if ($user) {
    // vérifier le mot de passe
    if (password_verify($motDePasse, $user['mot_de_passe'])) {
        session_start();
        $_SESSION['user_id'] = $user['id'];  // Enregistrer l'identifiant de l'utilisateur dans la session
        // Renvoyer les informations utilisateur avec success
        echo json_encode([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user['id'],
                'nom' => $user['nom'],  // Vous pouvez ajuster selon le nom de la colonne dans votre base
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
}

?>