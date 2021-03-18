import React, { Component } from "react";
import "/Users/adriannaguevarra/Desktop/Winter 2021/CS493FirebaseAuth/src/style.css";
import "bootstrap/dist/css/bootstrap.css";
import { Table, Button, Breadcrumb } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import firebase from "/Users/adriannaguevarra/Desktop/Winter 2021/CS493FirebaseAuth/src/firebaseConfig.js";
import includes from "lodash/includes";

const GENRES = "genres";
const ARTISTS = "artists";
const ALBUMS = "albums";
const SONGS = "songs";
const API_HOST =
  " https://935b4mrcb1.execute-api.us-east-1.amazonaws.com/dev";

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      songUrl: null,
      selectedGenre: null,
      selectedArtist: null,
      selectedAlbum: null,
      selectedSongIndex: null,
      selectedBreadcrumb: GENRES,
      genres: null,
      artists: null,
      albums: null,
      songs: null,
    };

    this.selectGenre = this.selectGenre.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.selectSong = this.selectSong.bind(this);
    this.logOut = this.logOut.bind(this);
    this.selectBreadcrumb = this.selectBreadcrumb.bind(this);
    this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this);
    this.sendSqsMessage = this.sendSqsMessage.bind(this);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;

    const params = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
        id: user.uid,
      }),
    };

  

    fetch(`${API_HOST}/genres`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        this.setState({ genres: jsonData, isLoaded: true });
      })
      .catch((err) => {
        alert(err);
      });
  }

  logOut(event) {
    const logOut = this.props.logOut;
    event.preventDefault();
    firebase
      .auth()
      .signOut()
      .then((user) => {
        logOut();
      })
      .catch((error) => {
        alert(`ERROR: ${error}`);
      });
  }

  selectGenre(event, index) {
    event.preventDefault();
    const { genres } = this.state;
    const selectedGenre = genres[index];

    fetch(`${API_HOST}/artists/for/genre?genre=${selectedGenre}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          artists: res,
          selectedGenre,
          selectedBreadcrumb: ARTISTS,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  selectArtist(event, index) {
    event.preventDefault();
    const { artists } = this.state;
    const selectedArtist = artists[index];

    fetch(`${API_HOST}/albums/for/artist?artist=${selectedArtist}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          albums: res,
          selectedArtist,
          selectedBreadcrumb: ALBUMS,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  selectAlbum(event, index) {
    event.preventDefault();
    const { albums } = this.state;
    const selectedAlbum = albums[index];

    fetch(`${API_HOST}/songs/for/album?album=${selectedAlbum}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ songs: res, selectedAlbum, selectedBreadcrumb: SONGS });
      })
      .catch((err) => {
        alert(err);
      });
  }

  selectSong(event, index) {
    event.preventDefault();
    const { songs } = this.state;
    const selectedSong = songs[index];

    fetch(`${API_HOST}/song?song=${selectedSong}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ songUrl: res.url, selectedSongIndex: index }, () => {
          this.refs.audio.pause();
          this.refs.audio.load();
          this.refs.audio.play();
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  selectBreadcrumb(event, breadcrumb) {
    event.preventDefault();
    this.setState({ selectedBreadcrumb: breadcrumb });
  }

  sendSqsMessage(event) {
    event.preventDefault();
    const {
      songs,
      selectedArtist,
      selectedAlbum,
      selectedSongIndex,
    } = this.state;
    const params = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artist: selectedArtist,
        album: selectedAlbum,
        song: songs[selectedSongIndex],
      }),
    };

    fetch(`${API_HOST}/play`, params)
      .then((res) => res.text())
      .then((res) => console.log(res))
      .catch((err) => {
        alert(err);
      });
  }

  renderData() {
    switch (this.state.selectedBreadcrumb) {
      case GENRES:
        return this.renderGenres();
      case ARTISTS:
        return this.renderArtists();
      case ALBUMS:
        return this.renderAlbums();
      case SONGS:
        return this.renderSongs();
      default:
        return this.renderGenres();
    }
  }

  renderGenres() {
    const { genres } = this.state;
    const selectGenre = this.selectGenre;

    return (
      <Table
        id="music-tbl"
        bsPrefix="table table-dark table-striped table-bordered table-hover"
      >
        <thead>
          <tr>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre, index) => {
            return (
              <tr key={index}>
                <td>
                  <Button
                    variant="info"
                    onClick={(event) => selectGenre(event, index)}
                  >
                    {genre}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  renderArtists() {
    const { artists } = this.state;
    const selectArtist = this.selectArtist;

    return (
      <Table
        id="music-tbl"
        bsPrefix="table table-dark table-striped table-bordered table-hover"
      >
        <thead>
          <tr>
            <th>Artists</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist, index) => {
            return (
              <tr key={index}>
                <td>
                  <Button
                    variant="info"
                    onClick={(event) => selectArtist(event, index)}
                  >
                    {artist}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  renderAlbums() {
    const { albums } = this.state;
    const selectAlbum = this.selectAlbum;

    return (
      <Table
        id="music-tbl"
        bsPrefix="table table-dark table-striped table-bordered table-hover"
      >
        <thead>
          <tr>
            <th>Albums</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album, index) => {
            return (
              <tr key={index}>
                <td>
                  <Button
                    variant="info"
                    onClick={(event) => selectAlbum(event, index)}
                  >
                    {album}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  renderSongs() {
    const { songs, selectedSongIndex } = this.state;
    const selectSong = this.selectSong;

    return (
      <Table
        id="music-tbl"
        bsPrefix="table table-dark table-striped table-bordered table-hover"
      >
        <thead>
          <tr>
            <th>Songs</th>
            <th>Play Songs</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => {
            return (
              <tr key={index}>
                <td>{song}</td>
                <td>
                  <Button
                    variant={
                      selectedSongIndex === index ? "info" : "outline-info"
                    }
                    onClick={(event) => selectSong(event, index)}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  renderBreadcrumbs() {
    const { genres, artists, albums, songs, selectedBreadcrumb } = this.state;
    const selectBreadcrumb = this.selectBreadcrumb;

    return (
      <Breadcrumb id="breadcrumbs">
        {genres &&
        includes([GENRES, ARTISTS, ALBUMS, SONGS], selectedBreadcrumb) ? (
          <Breadcrumb.Item
            id="breadcrumb-link"
            onClick={(event) => selectBreadcrumb(event, GENRES)}
          >
            Genres
          </Breadcrumb.Item>
        ) : null}
        {artists && includes([ARTISTS, ALBUMS, SONGS], selectedBreadcrumb) ? (
          <Breadcrumb.Item
            id="breadcrumb-link"
            onClick={(event) => selectBreadcrumb(event, ARTISTS)}
          >
            Artists
          </Breadcrumb.Item>
        ) : null}
        {albums && includes([ALBUMS, SONGS], selectedBreadcrumb) ? (
          <Breadcrumb.Item
            id="breadcrumb-link"
            onClick={(event) => selectBreadcrumb(event, ALBUMS)}
          >
            Albums
          </Breadcrumb.Item>
        ) : null}
        {songs && selectedBreadcrumb === SONGS ? (
          <Breadcrumb.Item
            id="breadcrumb-link"
            onClick={(event) => selectBreadcrumb(event, SONGS)}
          >
            Songs
          </Breadcrumb.Item>
        ) : null}
      </Breadcrumb>
    );
  }

  renderStuff() {
    const renderBreadcrumbs = this.renderBreadcrumbs;
    return (
      <Table
        id="music-tbl"
        bsPrefix="table table-dark table-striped table-bordered table-hover"
      >
        <thead>
          <tr>{renderBreadcrumbs()}</tr>
        </thead>
      </Table>
    );
  }

  renderAudio() {
    const { songUrl } = this.state;
    const sendSqsMessage = this.sendSqsMessage;
    return (
      <audio controls autoPlay ref="audio" id="audio" onPlay={sendSqsMessage}>
        <source src={songUrl} type="audio/mp4"></source>
        Your browser does not support the audio element.
      </audio>
    );
  }

  render() {
    return (
      <div>
        <Button variant="info" onClick={this.logOut}>
          Log Out
        </Button>
        {this.state.songUrl ? this.renderAudio() : null}
        {this.state.isLoaded ? this.renderBreadcrumbs() : null}
        {this.state.isLoaded ? this.renderData() : null}
      </div>
    );
  }
}

export default LoggedIn;
