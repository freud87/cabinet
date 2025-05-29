const client = new Appwrite.Client();
client
   .setEndpoint("https://fra.cloud.appwrite.io/v1") // Ton endpoint Appwrite
  .setProject("6834cfa3001cf140ff0e");              // Ton Project ID

const database = new Appwrite.Databases(client);
const databaseId = "683847b900299aa1a74e";
const collectionId = "683847d30033f996051f";

// dans ton form.addEventListener("submit", ...)
database.createDocument(
  databaseId,
  collectionId,
  Appwrite.ID.unique(),
  { /* données patient */ }
);


const formPatient = document.getElementById("form-patient");
const inputRdv = document.getElementById("rdv");
const champIdPatient = document.getElementById("idpatient");

// Désactiver tous les autres boutons + champ de recherche
function activerInterfacePatient(etat) {
  document.querySelectorAll("sidebar button:not([onclick*='afficherFormPatient'])").forEach(btn => btn.disabled = !etat);
  document.getElementById("search-input").disabled = !etat;
}

// Afficher formulaire
function afficherFormPatient() {
  const aujourdHui = new Date().toISOString().split("T")[0];
  inputRdv.value = aujourdHui;
  formPatient.style.display = "block";
  activerInterfacePatient(false);
}

// Cacher formulaire + reset
function annulerAjoutPatient() {
  formPatient.reset();
  formPatient.style.display = "none";
  champIdPatient.textContent = "";
  activerInterfacePatient(true);
}

// Générer ID patient auto
["prenom", "nom", "naissance"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    const prenom = document.getElementById("prenom").value.trim().toUpperCase();
    const nom = document.getElementById("nom").value.trim().toUpperCase();
    const naissance = document.getElementById("naissance").value;

    if (prenom && nom && naissance) {
      const date = new Date(naissance);
      const idPatient = prenom[0] + nom[0] +
        String(date.getFullYear()).slice(-2) +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
      champIdPatient.textContent = idPatient;
    } else {
      champIdPatient.textContent = "";
    }
  });
});

// Envoi vers Appwrite à l'ajout
formPatient.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    idpatient: champIdPatient.textContent,
    prenom: document.getElementById("prenom").value,
    nom: document.getElementById("nom").value,
    sexe: document.getElementById("sexe").value,
    naissance: document.getElementById("naissance").value,
    telephone: document.getElementById("telephone").value,
    adresse: document.getElementById("adresse").value,
    prochainrdv: document.getElementById("rdv").value,
    observations: document.getElementById("observations").value
  };

  try {
    await database.createDocument(
      databaseId,
      collectionId,
      Appwrite.ID.unique(),
      data
    );
    alert("Patient ajouté avec succès !");
    annulerAjoutPatient();
  } catch (err) {
    console.error("Erreur Appwrite :", err);
    alert("Erreur lors de l'ajout du patient.");
  }
});
