var template = _.template("<li><input class='fn-choice' type='checkbox' data-id='<%= id %>' /> <span class='badge'><%= id %></span> <span><%= name %></span></li>");
var heroes = [];
var totalQnt = 0;
var receivedQnt = 0;

$.ajax({
    url: "https://swapi.co/api/people/"
}).done(function(data) {
    totalQnt = data.count;
    getHeroes(data.count);
}).fail(function( jqXHR, textStatus ) {
    console.error( "Request 'https://swapi.co/api/people/' failed: ", jqXHR, textStatus );
});

function getHeroes(count) {
    for (var i = 1; i <= count; i++) {
        getHero(i)
    }
}

function getHero(i) {
    $.ajax({
        url: "https://swapi.co/api/people/" + i
    }).done(function(data) {
        heroes.push(_.extend({id: i}, data));
        if (++receivedQnt === totalQnt) {
            displayHeroes(heroes);
        }
    }).fail(function( jqXHR, textStatus ) {
        if (++receivedQnt === totalQnt) {
            displayHeroes(heroes);
        }
        console.error( "Request 'https://swapi.co/api/people/'" + i + " failed: ", jqXHR, textStatus );
    });
}

function displayHeroes(heroes) {
    heroes = _.sortBy(heroes, 'id');
    for (var i = 0; i < heroes.length; i++) {
        $('.fn-hero').append(template(heroes[i]));
    }
    $('.fn-hero').find('.fn-choice').on('change', choiceChangeClickHandler);
    restoreChoices();
}

function choiceChangeClickHandler(event) {
    storeChoice(event.currentTarget.dataset.id, event.currentTarget.checked)
}

function storeChoice(id, isAdd) {
    var choices = JSON.parse(window.localStorage.getItem('choices'));
    if (isAdd) {
        choices = addStoreChoice_(id, choices);
    } else {
        choices = delStoreChoice_(id, choices)
    }
    window.localStorage.setItem('choices', JSON.stringify(choices));
}

function addStoreChoice_(id, choices) {
    if (_.isArray(choices)) {
        choices.push(id);
    } else {
        choices = [id];
    }
    return choices;
}

function delStoreChoice_(id, choices) {
    return _.without(choices, id);
}

function restoreChoices() {
    var choices = JSON.parse(window.localStorage.getItem('choices'));
    var $container = $('.fn-hero');
    if (!_.isArray(choices)) {
        return;
    }
    for (var i = 0; i < choices.length; i++) {
        $container.find('[data-id="' + choices[i] + '"]').prop('checked', true);
    }
}
