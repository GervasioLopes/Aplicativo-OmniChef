// Importa as funções necessárias do SDK do Firebase que você precisará
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Sua configuração do Firebase que você me enviou
const firebaseConfig = {
  apiKey: "AIzaSyDluOQFC5x05wVQ577jamEOiMhS34ejFME",
  authDomain: "pi-projeto-ominichef.firebaseapp.com",
  projectId: "pi-projeto-ominichef",
  storageBucket: "pi-projeto-ominichef.appspot.com",
  messagingSenderId: "429147312192",
  appId: "1:429147312192:web:4b5b9106b48b2b20a98fa5",
  measurementId: "G-T2Y520214H"
};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta a instância do Firestore para que outras páginas possam usá-la
export const db = getFirestore(app);