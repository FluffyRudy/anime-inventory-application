const animeData = [
  {
    name: "Attack on Titan",
    release_date: "2013-04-07",
    completed_date: "2021-04-04",
    status: "Completed",
    creator: "Hajime Isayama",
    rating: 9.3,
    image_url: "https://example.com/attack_on_titan.jpg",
  },
  {
    name: "My Hero Academia",
    release_date: "2016-04-03",
    completed_date: null, // Still ongoing
    status: "Ongoing",
    creator: "Kohei Horikoshi",
    rating: 8.5,
    image_url: "https://example.com/my_hero_academia.jpg",
  },
  {
    name: "Demon Slayer",
    release_date: "2019-04-06",
    completed_date: null, // Still ongoing
    status: "Ongoing",
    creator: "Koyoharu Gotouge",
    rating: 8.6,
    image_url: "https://example.com/demon_slayer.jpg",
  },
  {
    name: "One Piece",
    release_date: "1999-10-20",
    completed_date: null, // Still ongoing
    status: "Ongoing",
    creator: "Eiichiro Oda",
    rating: 9.0,
    image_url: "https://example.com/one_piece.jpg",
  },
  {
    name: "Death Note",
    release_date: "2006-10-03",
    completed_date: "2007-06-27",
    status: "Completed",
    creator: "Tsugumi Ohba",
    rating: 9.0,
    image_url: "https://example.com/death_note.jpg",
  },
];
const insertAnimeSeriesQuery = `
INSERT INTO anime_series 
    (name, release_date, completed_date, status, creator, rating, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
`;

const constructObjStr = (obj) => {
  let res = "(";
  for (let key in obj) {
    const value = obj[key];
    if (!parseInt(value)) res += "'" + obj[key] + "'" + ", ";
    else res += obj[key] + ", ";
  }
  res = res.slice(0, -2);
  return res + ")";
};

// console.log(constructObjStr(animeData[0]));

const joiner = animeData.reduce((accm, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return accm + `${constructObjStr(data)}, `;
}, "");

console.log(joiner.slice(0, -2));
