const baseurl = "http://localhost:8080/"; //Définit l'url de base au cas nous changions de serveur
const defaultsec = 20;
const maxperquizz = 10;
//Variable global
var quizz;
var quizzindex = 0;
var sec;
var score = 0;
var setintval;


const fetchquizz = async (theme) => {
    if (theme) {
        var url = baseurl + 'quizz/' + theme + '.json';
        /* Vérifier si url ne retourne pas un 404. A faire apres*/
        let response = await fetch(url);
        let data = await response.json()
        return data;
    } else {
        alert("Theme ne doit pas être vide")
    }
}

function loadview(index, quizz) {
    let nextindex = index + 1 < maxperquizz ? index + 1 : false;
    if (nextindex != false) {
        $('#actionbutton').text('Question suivante').attr('nextaction', 'next');
        quizzindex = index
        let indexedquizz = quizz[index];
        console.log(indexedquizz);
        $('#question').text(indexedquizz.question)
        for (let index = 0; index < indexedquizz.propositions.length; index++) {
            $('#choix-' + index).text(indexedquizz.propositions[index]);

        }
    } else {
        $('#actionbutton').text('Reprendre une partie').attr('nextaction', 'restart');
        showanswer(quizz);
    }
    sec = defaultsec;
    setintval = setInterval(() => {
        sec--;
        if (sec > 0) {
            $('#displaytimer').html(sec);
            var nowpercentage = sec * 100 / defaultsec;
            var bgcolor = "red";
            if (nowpercentage > 60) {
                bgcolor = "green";
            } else if (nowpercentage > 25) {
                bgcolor = "yellow";
            }
            $('.timervisual').css({
                "width": nowpercentage + '%',
                "background-color": bgcolor
            });
        } else {
            $('#displaytimer').html(0);
            $('.timervisual').css({
                "width": '0%',
            });
            showanswer(quizz);
            clearInterval(setintval);

        }

    }, 1000);
    $('#myModal').modal('hide');
}


function showanswer(quizz, givedanswer = "") {

    if (givedanswer != "") {
        if (givedanswer == quizz[quizzindex].réponse) {
            score++;
            $('#boonoumauvaise').text("Bonne réponse").css('color', "green");
        } else {
            $('#boonoumauvaise').text("Mauvaise réponse").css('color', "red");
        }
    } else {
        $('#boonoumauvaise').text("Aucune réponse").css('color', "orange");
    }

    $('#reponse').text('Réponse : ' + quizz[quizzindex].réponse);
    $('#anectdote').text('Anecdote : ' + quizz[quizzindex].anecdote);
    /* Afficher le score et le boutton reprendre le jeux */

    $('#score').text('Score : ' + score + '/' + maxperquizz);
    /* get local storage */
    if (!localStorage.getItem("maxscore")) {
        localStorage.setItem("maxscore", score);
    } else {
        if (score > localStorage.getItem("maxscore")) {
            /* set new score */
            localStorage.setItem("maxscore", score);
        }
    }

    $('#maxscore').text('Meileure score : ' + localStorage.getItem("maxscore") + '/' + maxperquizz);
    $('#myModal').modal('show');
}
$(document).ready(function () {
    /* Ajouter un listener sur le themechange */

    $(document).on('click', '#themechange', function () {
        /* reqcupérer le nom du theme */
        var themename = $('select[name="choosetheme"]').val();
        /* Faire appel a la fonction fetch au changement du theme */
        fetchquizz(themename)
            .then(data => {
                //console.log(data)
                $('#displaythme').html(data.thème)
                var niveau = $('#levelchange').val();
                quizz = data.quizz[niveau];
                sec = defaultsec;
                loadview(quizzindex, quizz);
                $('.configgame').hide();
                $('.startgame').show();

            });

    });

    $(document).on('click', '.cus', function () {
        var clickedpropos = $(this).text();
        clearInterval(setintval);
        showanswer(quizz, clickedpropos)
    });

    $(document).on('click', '#actionbutton', function () {
        var getlastaction = $(this).attr('nextaction');
        if (getlastaction == "restart") {
            quizzindex = 0;
            score = 0;
            $('.configgame').show();
            $('.startgame').hide();
            $('#myModal').modal('hide');
        } else {
            loadview(quizzindex + 1, quizz);
        }

    })
})