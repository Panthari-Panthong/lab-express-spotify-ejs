require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (request, response) => {
  response.render("home");
});

app.get("/artist-search", (request, response) => {
  const artistName = request.query.name;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      //   console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render("artist", {
        artistAll: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response, next) => {
  const idArtist = request.params.artistId;
  //   console.log("ARTISID", idArtist);
  spotifyApi
    .getArtistAlbums(idArtist)
    .then((data) => {
      const allAlbums = data.body.items;

      response.render("albums", { allAlbums });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/track/:albumId", (request, response) => {
  const idAlbum = request.params.albumId;
  //   console.log("ARTISID", idAlbum);
  spotifyApi
    .getAlbumTracks(idAlbum)
    .then((data) => {
      //   console.log("The received data from the API: ", data.body);
      const allTracks = data.body.items;
      response.render("tracks", { allTracks });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
