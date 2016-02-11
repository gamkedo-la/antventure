var ext;

function setFormat() {
	var audio = new Audio();
	if( audio.canPlayType("audio/mp3")) {
		ext = ".mp3";
	} else {
		ext = ".ogg";
	}
}

setFormat();

var audio_music = new Audio("SFX/antventureTheme" + ext);
var audio_crumble = new Audio("SFX/CrumbleBrick" + ext);
var audio_crumbleBreak = new Audio("SFX/CrumbleBrickBreak" + ext);
var audio_squishSoundV1 = new Audio("SFX/squishSoundV1" + ext);
var audio_squishSoundV2 = new Audio("SFX/squishSoundV2" + ext);
var audio_walkingloop = new Audio("SFX/walkingloop" + ext);
var audio_bigSound = new Audio("SFX/big-sound" + ext);
var audio_softSound = new Audio("SFX/soft-sound" + ext);

audio_music.loop = true;
