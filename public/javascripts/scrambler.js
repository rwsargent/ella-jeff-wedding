var wordList = 
    ["Deaf Fan Jell", "Deaf Jan Fell", "Fade Fan Jell", "Fade Jan Fell", "Jade Fall Fen",
	"Jade Flan Elf", "Jade Fan Fell", "Fad Jean Fell", "Flea Jan Fled", "Leaf Jan Fled",
	"Jean Fall Def", "Jean Fall Fed", "Fa Fan Jelled", "Fa Jan Felled", "Fall Jan Feed",
	"A Fad Fen Jell", "A Fa Fend Jell", "A Fan Def Jell", "A Fan Fed Jell", "A Jan Def Fell",
	"A Jan Fed Fell", "A Jan Fled Elf", "Ad Fa Fen Jell", "Fad Fa Jell En", "Fad Jan Elf El",
	"Fa Fan Ed Jell", "Fa Jan Ed Fell", "Fa Jan Def Ell", "Fa Jan Fed Ell", "Fa Jan Fled El",
	"Fa Jan Led Elf", "Fa An Def Jell", "Fa An Fed Jell", "Jan La Def Elf", "Jan La Fed Elf"]

function getRandomWord() {
    return wordList[Math.random()*wordList.length]
};

function scrabblefyWords(words) {
    var tokens = words.split(" ");
    var orientation = true;

    for(words : words) {
	var letters = words.split("");
    }

    var boardObject =  { 
	this.horizontal = orientation;
	this.word
    };

}
