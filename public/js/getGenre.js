async function getGenres() {
  const genres = localStorage.getItem("genres");
  if (!genres) {
    const genresResponse = await (
      await fetch("http://localhost:3000/get-genres")
    ).json();
    localStorage.setItem("genres", JSON.stringify(genresResponse));
    return genresResponse;
  } else {
    return JSON.parse(genres);
  }
}

async function renderGenres() {
  const genres = await getGenres();

  const genreList = genres
    .map((genre) => {
      return `
            <li>
                <input
                    class="genre-checkbox"
                    type="checkbox"
                    name="genre"
                    value="${genre}"
                    id="${genre}"
                />
                <label class="genre-checkbox-label" for="${genre}">${genre}</label>
            </li>
        `;
    })
    .join("");

  document.querySelector(".genre-checkbox-list").innerHTML = genreList;
}

document.addEventListener("DOMContentLoaded", renderGenres);
