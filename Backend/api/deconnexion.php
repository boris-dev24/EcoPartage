<?php
session_start(); // Démarre la session

// Détruit toutes les données de la session
session_destroy();

// Renvoie une réponse JSON pour indiquer que la déconnexion a réussi
echo json_encode(['success' => true, 'message' => 'Déconnexion réussie']);
?>