# music Yeoman Generator


Interactive CLI tool to upload file(s) to S3 and DynamoDB

## Installation

1. Install repo
```
git clone https://github.com/adrianna157/CLI-DDB-Part-2.git
```

2. Install packages
```
npm install
```

3. Link package
```
npm link
```

4. Follow the prompts and upload that music!
```
yo music
```

## Assumptions



- This tool assumes you have permission to assume the role `contractors`


## Notes

- Files are uploaded to S3 bucket with the following key format `genre/artist/album/song`
- User will be prompted for the genre **at all times**
- All resources must have an associated genre, artist, album, and song title
	- If users do not provide the file path, they will not move forward until they do
- User will be prompted to change the name of the resource you are uploading
	- When uploading an artist, it will prompt the user to change the name of the artist
	- When uploading an album, it will prompt the user to change the name of the album
	- When uploading an song, it will prompt the user to change the name of the song
- When you upload a directory (an artist or an album) you can change the root name but everything else will stay the same

```
Example
-------

- artist
	- album_1
		- song_1
		- song_2
	- album_2
		- song_1
		- song_2

Upload files:
prompted_genre/prompted_artist/album_1/song_1
prompted_genre/prompted_artist/album_1/song_2
prompted_genre/prompted_artist/album_2/song_1
prompted_genre/prompted_artist/album_2/song_2

```
# CLI-DDB-Part-2
