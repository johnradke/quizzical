window.qz = window.qz || {};

(function(qz) {
    var quizzes = [
        {
            name: 'Temperature',
            units: ['Celsius', 'Fahrenheit'],
            unitAbbrevs: ['°C', '°F'],
            convert: function(c) { return Math.round((c * 9 / 5) + 32); },
            min: -50,
            max: 121
        }
    ];

    var spacingMultiplier = .02;
    var spreadMultiplier = .12;

    function identityFunc(x) { return x; }

    function newQuestion(quiz) {
        w.id('quiz').style.opacity = 0;

        // use setTimeout to give the fade out time to act
        setTimeout(function() {
            var choices = getChoices(quiz);

            var choiceEls = w.cl('choice');
            var u = w.rand(2);
            var qFunc = u ? quiz.convert : identityFunc;
            var aFunc = u ? identityFunc : quiz.convert;
            var target = w.pick(choices);

            w.id('query').setText(qFunc(target));
            w.id('oldUnit').setText(quiz.unitAbbrevs[u]);
            w.id('newUnit').setText(quiz.units[1 - u]);
            choices.forEach(function(choice, i) {
                choiceEls[i].setText(aFunc(choice) + quiz.unitAbbrevs[1 - u]);
                choiceEls[i].value = choice;
                
                choiceEls[i].onclick = function() {
                    this.classList.add('selected');
                    w.id('quiz').classList.add('answered');

                    var winner = false;
                    choiceEls.forEach(function(el) {
                        if (el.value === target) {
                            el.classList.add('winner');
                            
                            if (el.classList.contains('selected'))
                                winner = true;
                        }
                        else 
                            el.classList.add('loser');
                    });

                    updateScore(winner);
                }
            });
            
            w.id('quiz').style.opacity = 1;
        }, 400);
    }

    function updateScore(winner) {
        var correctEl = w.id('correct');
        var totalEl = w.id('total');
        
        var count = parseInt(correctEl.textContent, 10);
        
        if (winner) {
            count = count + 1
            correctEl.setText(count);
        }

        var newTotal = parseInt(totalEl.textContent, 10) + 1;
        totalEl.setText(newTotal);
        w.id('percent').setText((count / newTotal * 100).toFixed(2));
    }
    
    function getChoices(quiz) {
        var spreadSize = Math.round((quiz.max - quiz.min) * spreadMultiplier);
        var spreadMin = w.rand(quiz.min, quiz.max - spreadSize);
        var spreadMax = spreadMin + spreadSize;

        var choices = [];
        var exclusions = [];
        var spacingSize = Math.round((quiz.max - quiz.min) * spacingMultiplier);
        w.range(4).forEach(function() {
            var choice = w.randExclude(spreadMin, spreadMax, exclusions);
            choices.push(choice);
            exclusions.pushArray(w.range(choice - spacingSize, choice + spacingSize));
        });

        choices.numSort();
        return choices;
    }

    function resetCss() {
        w.cl('choice').forEach(function(el) {
            el.classList.remove('winner');
            el.classList.remove('loser');
            el.classList.remove('selected');
        })

        w.id('quiz').classList.remove('answered');
    }

    qz.start = function start() {
        console.log(this);
        newQuestion(quizzes[0]);

        w.id('next').onclick = function() {
            resetCss();
            newQuestion(quizzes[0]);
        };
    };

    // reveal private members for testing purposes.
    qz._reveal = function _reveal() {
        this.getChoices = getChoices;
        this.quizzes = quizzes;
        this._hide = function _hide() {
            delete this.getChoices;
            delete this.quizzes;
            delete this._hide;
        };
    };

})(window.qz);