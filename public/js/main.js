import { auth, db, provider } from "./Auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

auth.languageCode = 'pt-BR';

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem("username", user.displayName);
    localStorage.setItem("useremail", user.email);
    localStorage.setItem("userphoto", user.photoURL);
    localStorage.setItem("useruid", user.uid);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Primeira vez
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        useruid: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } else {
      // Login recorrente
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString()
      });
    }

    window.location.href = "user-dashboard.html";

  } catch (error) {
    console.error("Erro ao fazer login:", error?.message || error);
    alert("Erro ao fazer login com o Google: " + (error?.message || error));
  }
}

// Login 
