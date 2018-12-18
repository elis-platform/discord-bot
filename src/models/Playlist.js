class Playlist {

    constructor(guildId, playlistName, creator, allowOtherToModify=true) {
        this.guildId = guildId;
        this.name = playlistName;
        this.creator = creator;
        this.allowOtherToModify = allowOtherToModify;
        this.songs = [];
    }

    insereMusicas(songs) {
        this.songs.push(...songs);
    }

}

module.exports = Playlist;
