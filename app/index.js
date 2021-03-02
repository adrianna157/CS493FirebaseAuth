'use strict';

const Generator = require('yeoman-generator');
const fs = require('fs-extra');
const AWS = require('aws-sdk');
const _  = require('lodash');
const glob = require('glob');

const BUCKET = "music-storage-cs493192711-dev";
const TABLE = 'music';

let genre;
let artist;
let album;
let uploadType;
let keyName;
let resourceLocation;
let s3;
let dynamoDb;
let musicFiles;

const musicPrompts = [
    {
        type: 'list',
        name: 'uploadType',
        message: 'What kind of upload would you like to perform?',
        choices: [
            'Song',
            'Album',
            'Artist'
        ]
    },
    {
        type: 'input',
        name: 'genre',
        message: 'What is the genre of this music?',
        validate(answer) {
            if (/^[a-zA-Z0-9-_.]*$/.test(answer) && answer.trim()) {
                return true;
            }
            return 'Genre must only contain alphanumeric characters, dashes, or underscores.';
        }
    },
    {
        type: 'input',
        name: 'artist',
        message: 'What artist sings this music?',
        validate(answer) {
            if (/^[a-zA-Z0-9-_.]*$/.test(answer) && answer.trim()) {
                return true;
            }
            return 'Artist must only contain alphanumeric characters, dashes, or underscores.';
        },
        when(answers) {
            return _.includes(['Song', 'Album'], answers.uploadType);
        }
    },
    {
        type: 'input',
        name: 'album',
        message: 'What album does this music belong to?',
        validate(answer) {
            if (/^[a-zA-Z0-9-_.]*$/.test(answer) && answer.trim()) {
                return true;
            }
            return 'Album must only contain alphanumeric characters, dashes, or underscores.';
        },
        when(answers) {
            return answers.uploadType === 'Song';
        }
    },
    {
        type: 'input',
        name: 'keyName',
        message: 'What would you like it to be named?',
        validate(answer) {
            if (/^[a-zA-Z0-9-_.]*$/.test(answer) && answer.trim()) {
                return true;
            }
            return 'Name must only contain alphanumeric characters, dashes, or underscores.';
        }
    },
    {
        type: 'input',
        name: 'resourceLocation',
        message: 'Where is this file located?',
        validate(answer) {
            if (fs.existsSync(answer) && fs.statSync(answer).isFile()) {
                return true;
            }
            return 'File not found. Enter a valid relative path.';
        },
        when(answers) {
            return answers.uploadType === 'Song';
        }
    },
    {
        type: 'input',
        name: 'resourceLocation',
        message: 'Where is this directory located?',
        validate(answer) {
            if (fs.existsSync(answer) && fs.statSync(answer).isDirectory()) {
                return true;
            }
            return 'Directory not found. Enter a valid relative path.';
        },
        when(answers) {
            return _.includes(['Album', 'Artist'], answers.uploadType);
        }
    }
];

function getData(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

function getFiles(location, pattern) {
    return new Promise(function(resolve, reject) {
        return glob(location + pattern, (err, matches) => {
            if (err) {
                return reject(err);
            }
            const files = _.filter(matches, (match) => fs.statSync(match).isFile());
            return resolve(files);
        });
    });
}

function generatemusicObject(fileName) {
    const fileParts = uploadType === 'Album' ? _.last(fileName.split('/')) : _.takeRight(fileName.split('/'), 2);
    const item = fileParts.length === 2 ?
        { genre, artist_album_song: `${keyName}/${fileParts[0]}/${fileParts[1]}`, artist: keyName, album: fileParts[0], song: fileParts[1], s3Key: `${genre}/${keyName}/${fileParts[0]}/${fileParts[1]}` } :
        { genre, artist_album_song: `${artist}/${keyName}/${fileParts}`, artist, album: keyName, song: fileParts, s3Key: `${genre}/${artist}/${keyName}/${fileParts}` };
    return item;
}

function uploadToS3(location, prefix) {
    return new Promise(function(resolve, reject) {
        return getData(location)
            .then(res => s3.putObject({ Bucket: BUCKET, Key: prefix, Body: res }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            }));
    });
}

function uploadToDynamo(item) {
    return new Promise(function(resolve, reject) {
        return dynamoDb.batchWrite(item, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

module.exports = class extends Generator {
    assumeRole() {
        const done = this.async();

        const sts = new AWS.STS();
        const assumeRoleParams = {
          RoleArn: "arn:aws:iam::466469553065:role/sssAdmin",
          RoleSessionName: "sssAdmin",
        };

        sts.assumeRole(assumeRoleParams).promise()
            .then(res => {
                const assumedRoleCredentials = {
                  accessKeyId: process.env.accessKeyId,
                  secretAccessKey: process.env.secretAccessKey,
                  region: "us-east-1",
                };
                s3 = new AWS.S3(assumedRoleCredentials);
                dynamoDb = new AWS.DynamoDB.DocumentClient(assumedRoleCredentials);
                done();
            })
            .catch(err => {
                console.log(`Whoopsie daisies! Looks like an error occured when trying to assume role: ${err.message}`);
                process.exit(1);
            });
    }

    promptmusic() {
        const done = this.async();

        return this.prompt(musicPrompts).then(answers => {
            genre = answers.genre;
            artist = answers.artist;
            album = answers.album;
            uploadType = answers.uploadType;
            keyName = answers.keyName;
            resourceLocation = answers.resourceLocation;
            done();
        });
    }

    uploadFiles() {
        const done = this.async();

        if (uploadType === 'Song') {
            uploadToS3(resourceLocation, `${genre}/${artist}/${album}/${keyName}`)
                .then(res => {
                    const item = {
                        genre,
                        artist_album_song: `${artist}/${album}/${keyName}`,
                        artist,
                        album,
                        song: keyName,
                        s3Key: `${genre}/${artist}/${album}/${keyName}`
                    };

                    return dynamoDb.put({ Item: item, TableName: TABLE }).promise();
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(`Hold the phone! An error occured when uploading your file: ${err.message}`);
                    done();
                });
        } else {
            const pattern = uploadType === 'Album' ? '/*' : '/**/*';
            getFiles(resourceLocation, pattern)
                .then(files => {
                    musicFiles = files;
                    const promises = _.map(files, file => {
                        const musicObject = generatemusicObject(file);
                        return uploadToS3(file, musicObject.s3Key);
                    });
                    return Promise.all(promises);
                })
                .then(res => {
                    console.log(res);
                    const promises = _.map(musicFiles, file => {
                        const musicObject = generatemusicObject(file);
                        return { PutRequest: { Item: musicObject } };
                    });
                    return uploadToDynamo({ RequestItems: { 'music': promises } });
                })
                .then(res => {
                    console.log(res);
                    done();
                })
                .catch(err => {
                    console.log(`Uh oh spaghettios! Something went wrong when uploading your files: ${err.message}`);
                    done();
                });
        }
    }
};
