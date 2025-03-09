import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../style/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch user data when authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await fetchUserData(authUser.uid); // Call function with `uid`
      } else {
        setUser(null);
        setUserDetails(null);
      }
      setLoading(false); // Stop loading after checking auth state
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Fetch user details from Firestore
  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, "Users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log("User data:", docSnap.data());
      } else {
        console.log("No user document found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      {userDetails ? (
        <>
          <div className="profile-header">
            {userDetails.photo && (
              <img
                src={userDetails.photo}
                width={"150px"}
                height={"150px"}
                alt="Profile"
              />
            )}
            <h3>Bienvenue {userDetails.firstName} 🙏🙏</h3>
          </div>
          
          <div className="profile-details">
            <p>Email: {userDetails.email}</p>
            <p>Nom: {userDetails.firstName}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            se deconnecter
          </button>
        </>
      ) : (
        <p>User not logged in. Please <a href="/login">login</a>.</p>
      )}
    </div>
  );
}

export default Profile;
