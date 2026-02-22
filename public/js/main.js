
// js/main.js
import { auth, db, provider } from "./Auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

auth.languageCode = 'pt-BR';

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem("username", user.displayName);
    localStorage.setItem("useremail", user.email);
    localStorage.setItem("userphoto", user.photoURL);
    localStorage.setItem("useruid", user.uid);

    //  Agora salva os dados em 'users', mantendo campos como role (se já existir)
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      useruid: user.uid,
      lastLogin: new Date().toISOString(),
      // createdAt: new Date().toISOString(),
    }, { merge: true }); // <- evita apagar o campo role

    window.location.href = "user-dashboard.html";
  } catch (error) {
    console.error("Erro ao fazer login:", error?.message || error);
    alert("Erro ao fazer login com o Google: " + (error?.message || error));
  }
}

// login com o servidor