var socket = io.connect({ 'forceNew': true });
var pStory = document.getElementById('pStory');
var nowWord;

socket.on('story', function (data) {
	renderStory(data);
});

socket.on('new-word', function (data) {
	renderWord(data);
});

document.getElementById('enviar_historia').onclick = function () {
	var auth = document.getElementById('author').value;
	var mess = document.getElementById('message').value;
	sendStory(auth, mess);	
};

function sendStory(author, text) {
	if(author != ""){
		if(text.toLowerCase().includes(nowWord.toLowerCase())){
			var part = {
				author: author,
				text: text
			}
			socket.emit('sent-story', part);
			document.getElementById('message').value = "";
		}
		else {
			alert("La palabra actual no está en el texto");
		}
	} else {
		alert("El nombre de usuario no puede estár vacio");	
	}
}

function renderWord(wordGet) {
	document.getElementById('wordText').innerHTML=wordGet;
	nowWord = wordGet;
}

function renderStory(data) {
	var html = data.map(function (elem, index) {
		return (`<span class="tooltipped" data-position="top" data-delay="50" data-tooltip="Autor: ${elem.author}">${elem.text}</span>`);
	}).join(" ");
	document.getElementById('pStory').innerHTML = html;
	$('.tooltipped').tooltip();
}

(function ($) {
	$(function () {
		$('.parallax').parallax();
	}); // end of document ready
})(jQuery); // end of jQuery name space
