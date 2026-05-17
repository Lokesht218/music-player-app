const mainInput = document.getElementById("mainInput");
const fileInput = document.getElementById("fileInput");
const player = document.getElementById("audioPlayer");
const songName = document.getElementById("songName");
const resultsList = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");
const albumArt = document.getElementById("albumArt");
const body = document.body;
const background = document.querySelector(".background");

/* Search Button */

searchBtn.addEventListener("click", () => {
  searchSongs(mainInput.value);
});

/* Enter Search */

mainInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchSongs(mainInput.value);
  }
});

/* Upload Song */

fileInput.addEventListener("change", function () {

  const file = this.files[0];

  if (file) {

    const url = URL.createObjectURL(file);

    player.src = url;
    player.play();

    songName.textContent = "🎶 " + file.name;

    document.body.classList.add("playing");
  }
});

/* Play Animation */

player.addEventListener("play", () => {
  document.body.classList.add("playing");
});

player.addEventListener("pause", () => {
  document.body.classList.remove("playing");
});

/* Search Songs */

async function searchSongs(query) {

  if (!query.trim()) return;

  resultsList.innerHTML = "<li>Searching...</li>";

  try {

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`
    );

    const data = await response.json();

    resultsList.innerHTML = "";

    data.results.forEach(song => {

      const li = document.createElement("li");

      li.innerHTML = `
        🎵 ${song.trackName}
        <br>
        <small>${song.artistName}</small>
      `;

      li.onclick = () => {

        player.src = song.previewUrl;

        player.play();

        songName.textContent = "🎶 " + song.trackName;

        /* Change Album */
        albumArt.src = song.artworkUrl100.replace("100x100", "600x600");

        /* Dynamic Background */
        background.style.backgroundImage =
          `url('${song.artworkUrl100.replace("100x100","600x600")}')`;

        document.body.classList.add("playing");
      };

      resultsList.appendChild(li);

    });

  } catch (error) {

    resultsList.innerHTML =
      "<li>❌ Error loading songs</li>";
  }
}