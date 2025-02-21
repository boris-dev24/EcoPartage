<?php
// header('Access-Control-Allow-Origin: *'); // Permet à toutes les origines d'accéder aux ressources
// header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Méthodes autorisées
// header('Access-Control-Allow-Headers: Content-Type'); // En-têtes autorisés


include '../config.php';

// recuperer les donnees envoyees en json
$data = json_decode(file_get_contents('php://input'), true);

// recuperer les champs formulaires
$nom = $data['nom'];
$email = $data['email'];
$adresse = $data['adresse'];
$motDePasse = password_hash($data['motDePasse'], PASSWORD_BCRYPT);

// Vérifier si l'email existe déjà
$checkEmailSql = "SELECT COUNT(*) FROM utilisateurs WHERE email = :email";
$checkStmt = $pdo->prepare($checkEmailSql);
$checkStmt->execute(['email' => $email]);
$emailExists = $checkStmt->fetchColumn();

if ($emailExists > 0) {
    echo json_encode(['success' => false, 'message' => 'L\'email est déjà utilisé.']);
    exit;
}

// inserer les donnees dans la base de donnee
$sql = "INSERT INTO utilisateurs (nom, email, adresse, mot_de_passe) VALUES (:nom, :email, :adresse, :motDePasse)";
$stmt = $pdo->prepare($sql);
$stmt->execute(['nom' => $nom, 'email' => $email, 'adresse' => $adresse, 'motDePasse' => $motDePasse]);

// Récupérer l'ID de l'utilisateur inséré
$userId = $pdo->lastInsertId();

// Renvoi d'une réponse avec l'objet utilisateur
echo json_encode([
  'success' => true, 
  'message' => 'Inscription réussie', 
  'user' => ['id' => $userId, 'nom' => $nom, 'email' => $email, 'adresse' => $adresse]
]);
?>
