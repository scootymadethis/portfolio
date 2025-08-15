window.addEventListener("load", (event) => {
  new cursoreffects.ghostCursor();

  animazioneDescrizione();
  getDiscordActivity("608635403548884992");
});

async function animazioneDescrizione() {
  const frasePresentazione =
    "Sono un developer full-stack di 17 anni con sede in Italia.";
  const fraseSplit = frasePresentazione.split("");
  const intervallo = 40;

  const descrizione = document.querySelector(".descrizione");
  descrizione.innerHTML =
    '<span class="descrizione-testo"></span><span class="barra"></span>';

  const descrizioneTesto = descrizione.querySelector(".descrizione-testo");

  for (let i = 0; i < fraseSplit.length; i++) {
    descrizioneTesto.innerHTML += fraseSplit[i];
    await sleep(intervallo);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDiscordActivity(userID) {
  const contenitori = document.querySelectorAll(".canzone");

  contenitori.forEach((cont) => {
    cont.ultimaCanzone = "";
    cont.ultimaArtista = "";
    cont.posTitolo = 0;
    cont.posArtista = 0;
    cont.velocitaTitolo = 0.3;
    cont.velocitaArtista = 0.3;
    cont.pausedTitolo = true;
    cont.pausedArtista = true;
  });

  function scrollTesto(elemento, container, cont, tipo) {
    let pos, velocita, paused;
    if (tipo === "titolo") {
      pos = cont.posTitolo;
      velocita = cont.velocitaTitolo;
      paused = cont.pausedTitolo;
    } else {
      pos = cont.posArtista;
      velocita = cont.velocitaArtista;
      paused = cont.pausedArtista;
    }

    if (!paused) {
      pos -= velocita;
      if (pos <= -elemento.scrollWidth) pos = container.clientWidth;
      elemento.style.transform = `translateX(${pos}px)`;
    }

    if (tipo === "titolo") cont.posTitolo = pos;
    else cont.posArtista = pos;
  }

  function aggiornaScroll() {
    contenitori.forEach((cont) => {
      const contInfoCanzone = cont.querySelector(".info");
      const titoloCanzone = contInfoCanzone.querySelector(".titolo");
      const artistaCanzone = contInfoCanzone.querySelector(".artista");
      const containerTitolo =
        contInfoCanzone.querySelector(".titolo-container");

      let containerArtista =
        contInfoCanzone.querySelector(".artista-container");
      if (!containerArtista) {
        containerArtista = document.createElement("div");
        containerArtista.classList.add("artista-container");
        artistaCanzone.parentNode.insertBefore(
          containerArtista,
          artistaCanzone
        );
        containerArtista.appendChild(artistaCanzone);
      }

      scrollTesto(titoloCanzone, containerTitolo, cont, "titolo");
      scrollTesto(artistaCanzone, containerArtista, cont, "artista");
    });
    requestAnimationFrame(aggiornaScroll);
  }

  contenitori.forEach((cont) => {
    const contInfoCanzone = cont.querySelector(".info");
    const titoloCanzone = contInfoCanzone.querySelector(".titolo");
    const artistaCanzone = contInfoCanzone.querySelector(".artista");
    const containerTitolo = contInfoCanzone.querySelector(".titolo-container");

    let containerArtista = contInfoCanzone.querySelector(".artista-container");
    if (!containerArtista) {
      containerArtista = document.createElement("div");
      containerArtista.classList.add("artista-container");
      artistaCanzone.parentNode.insertBefore(containerArtista, artistaCanzone);
      containerArtista.appendChild(artistaCanzone);
    }

    containerTitolo.addEventListener(
      "mouseenter",
      () => (cont.pausedTitolo = true)
    );
    containerTitolo.addEventListener(
      "mouseleave",
      () => (cont.pausedTitolo = false)
    );
    containerArtista.addEventListener(
      "mouseenter",
      () => (cont.pausedArtista = true)
    );
    containerArtista.addEventListener(
      "mouseleave",
      () => (cont.pausedArtista = false)
    );
  });

  aggiornaScroll();

  async function aggiornaCanzone() {
    try {
      const response = await fetch(
        "https://api.lanyard.rest/v1/users/" + userID
      );
      const data = await response.json();
      const rData = data.data;

      contenitori.forEach((cont) => {
        const contInfoCanzone = cont.querySelector(".info");
        const titoloCanzone = contInfoCanzone.querySelector(".titolo");
        const artistaCanzone = contInfoCanzone.querySelector(".artista");
        const coverCanzone = cont.querySelector(".cover");
        const ascoltaCanzoneBtn = contInfoCanzone.querySelector(".ascolta");
        const ascoltaCanzone = contInfoCanzone.querySelector(".ascolta a");
        const containerTitolo =
          contInfoCanzone.querySelector(".titolo-container");

        let containerArtista =
          contInfoCanzone.querySelector(".artista-container");
        if (!containerArtista) {
          containerArtista = document.createElement("div");
          containerArtista.classList.add("artista-container");
          artistaCanzone.parentNode.insertBefore(
            containerArtista,
            artistaCanzone
          );
          containerArtista.appendChild(artistaCanzone);
        }

        if (rData.listening_to_spotify) {
          const spotifyData = rData.spotify;
          const artistaFormatted = spotifyData.artist.split(";").join(",");

          if (
            spotifyData.song !== cont.ultimaCanzone ||
            artistaFormatted !== cont.ultimaArtista
          ) {
            cont.ultimaCanzone = spotifyData.song;
            cont.ultimaArtista = artistaFormatted;

            coverCanzone.src = spotifyData.album_art_url;
            titoloCanzone.innerHTML = spotifyData.song;
            artistaCanzone.innerHTML = artistaFormatted;
            ascoltaCanzoneBtn.style.display = "block";
            ascoltaCanzone.href =
              "https://open.spotify.com/intl-it/track/" + spotifyData.track_id;

            cont.posTitolo = 0;
            cont.posArtista = 0;

            if (titoloCanzone.scrollWidth <= containerTitolo.clientWidth) {
              cont.velocitaTitolo = 0;
              titoloCanzone.style.transform = "translateX(0)";
            } else {
              cont.pausedTitolo = true;
              cont.pausedTitolo = false;
              cont.velocitaTitolo = 0.3;
            }

            if (artistaCanzone.scrollWidth <= containerArtista.clientWidth) {
              cont.velocitaArtista = 0;
              artistaCanzone.style.transform = "translateX(0)";
            } else {
              cont.pausedArtista = true;
              cont.pausedArtista = false;
              cont.velocitaArtista = 0.3;
            }
          }
        } else {
          cont.ultimaCanzone = "";
          cont.ultimaArtista = "";
          titoloCanzone.innerHTML = "Niente";
          artistaCanzone.innerHTML = "Nessuno";
          coverCanzone.src = "assets/nosong.png";
          ascoltaCanzoneBtn.style.display = "none";
          cont.posTitolo = 0;
          cont.posArtista = 0;
          cont.velocitaTitolo = 0;
          cont.velocitaArtista = 0;
        }
      });
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  }

  setInterval(aggiornaCanzone, 1000);
}

document.querySelector(".chi-sono-btn").addEventListener("click", function () {
  document.querySelector(".chi-sono-text").scrollIntoView({
    behavior: "smooth", // scorrimento graduale
  });
});

document.querySelector(".codice-btn").addEventListener("click", function () {
  window.open("https://github.com/scootymadethis/portfolio", "_blank");
});

const techButtons = [
  document.querySelectorAll(".logo.html"),
  document.querySelectorAll(".logo.css"),
  document.querySelectorAll(".logo.figma"),
  document.querySelectorAll(".logo.mongodb"),
  document.querySelectorAll(".logo.discordjs"),
  document.querySelectorAll(".logo.python"),
  document.querySelectorAll(".logo.javascript"),
  document.querySelectorAll(".logo.nodejs"),
  document.querySelectorAll(".logo.windows"),
  document.querySelectorAll(".logo.linux"),
  document.querySelectorAll(".logo.macos"),
  document.querySelectorAll(".logo.vscode"),
  document.querySelectorAll(".logo.cloudflare"),
  document.querySelectorAll(".logo.porkbun"),
  document.querySelectorAll(".logo.vercel"),
  document.querySelectorAll(".logo.git"),
  document.querySelectorAll(".logo.github"),
  document.querySelectorAll(".logo.insomnia"),
  document.querySelectorAll(".logo.npm"),
];

const techLinks = [
  "https://developer.mozilla.org/docs/Web/HTML", // HTML
  "https://developer.mozilla.org/docs/Web/CSS", // CSS
  "https://www.figma.com/", // Figma
  "https://www.mongodb.com/", // MongoDB
  "https://discord.js.org/", // DiscordJS
  "https://www.python.org/", // Python
  "https://developer.mozilla.org/docs/Web/JavaScript", // JavaScript
  "https://nodejs.org/", // NodeJS
  "https://www.microsoft.com/windows", // Windows
  "https://www.linux.org/", // Linux
  "https://www.apple.com/macos/", // MacOS
  "https://code.visualstudio.com/", // Visual Studio Code
  "https://www.cloudflare.com/", // Cloudflare
  "https://porkbun.com/", // Porkbun
  "https://vercel.com/", // Vercel
  "https://git-scm.com/", // Git
  "https://github.com/", // GitHub
  "https://insomnia.rest/", // Insomnia
  "https://www.npmjs.com/", // NPM
];

for (let i = 0; i < techButtons.length; i++) {
  techButtons[i].forEach((button) => {
    button.addEventListener("click", function () {
      window.open(techLinks[i], "_blank");
    });
  });
}

const socialButtons = [
  document.querySelector(".social.discord"),
  document.querySelector(".social.instagram"),
  document.querySelector(".social.github"),
  document.querySelector(".social.steam"),
  document.querySelector(".social.spotify"),
  document.querySelector(".social.youtube"),
  document.querySelector(".social.email"),
];

const socialLinks = [
  "https://discord.com/users/608635403548884992",
  "https://www.instagram.com/prod.scooty/",
  "https://github.com/scootymadethis",
  "https://steamcommunity.com/id/prodscooty/",
  "https://open.spotify.com/intl-it/artist/0RCAbLUgEEp6sEJH1Prdom?si=Nt5a8VWBT0SNzEKFUJIkVQ",
  "https://www.youtube.com/@prod.scooty",
  "mailto:fedescu08@gmail.com",
];

for (let i = 0; i < socialButtons.length; i++) {
  socialButtons[i].addEventListener("click", function () {
    window.open(socialLinks[i], "_blank");
  });
}
