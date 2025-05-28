async function envoyerFormulaire() {
  const form = document.getElementById("patient-form");
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");
  
  // Masquer les messages précédents
  successMessage.style.display = "none";
  errorMessage.style.display = "none";

  // Validation du formulaire
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Préparer les données
  const formData = new FormData(form);
  const data = {
    action: "addPatient",
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    sexe: formData.get("sexe"),
    dateNaissance: formData.get("dateNaissance"),
    telephone: formData.get("telephone"),
    adresse: formData.get("adresse"),
    observations: formData.get("observations"),
    dateRdv: formData.get("dateRdv")
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxQ3tz6GH7DK0-fytd947B0PNcyzgfOgn_M7e37piaCifj7HSA40E5oSjwa8MmE7DDd/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (result.success) {
      // Afficher le message de succès
      successMessage.style.display = "block";
      
      // Afficher l'ID généré
      const idDisplay = document.getElementById("patient-id-display");
      const idSpan = document.getElementById("generated-id");
      idSpan.textContent = result.patientId;
      idDisplay.style.display = "block";
      
      // Redirection après délai
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    } else {
      // Afficher l'erreur
      errorMessage.textContent = result.message || "Une erreur est survenue";
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Erreur:", error);
    errorMessage.textContent = "Erreur de connexion au serveur";
    errorMessage.style.display = "block";
  }
}

// Fonction pour générer un ID temporaire (optionnel)
function genererID() {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const naissance = document.getElementById("naissance").value;
  
  if (nom && prenom && naissance) {
    const idTemp = `${nom.substring(0, 3).toUpperCase()}${prenom.substring(0, 3).toUpperCase()}${naissance.replace(/-/g, "").substring(2)}`;
    document.getElementById("id").value = idTemp;
    document.getElementById("generated-id").textContent = idTemp;
    document.getElementById("patient-id-display").style.display = "block";
  }
}

// Écouteurs d'événements pour générer l'ID
document.getElementById("nom").addEventListener("input", genererID);
document.getElementById("prenom").addEventListener("input", genererID);
document.getElementById("naissance").addEventListener("input", genererID);