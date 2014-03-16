var qz = {
    quizzes: [
        {
            name: 'Temperature',
            units: ['Celsius', 'Fahrenheit'],
            unitAbbrevs: ['°C', '°F'],
            convert: function(c) { return Math.round((c * 9 / 5) + 32); },
            min: -50,
            max: 121
        }
    ],
    spacingMultiplier: .02,
    spreadMultiplier: .12,
    noConvert: function(x) { return x; },
    newQuestion: function(props) {
        $.id('quiz').style.opacity = 0;

        // use setTimeout to give the fade out time to act
        setTimeout(function() {
            var target = $.rand(props.min, props.max);

            var spacing = Math.round(qz.spacingMultiplier * (props.max - props.min));
            var choices = [target];
            var exclusions = $.range(target - spacing, target + spacing);

            var spread = Math.round(qz.spreadMultiplier * (props.max - props.min));
            var spreadMin = target - spread;
            var spreadMax = target + spread;

            for (var i = 0; i < 3; i++) {
                var choice = $.randExclude(spreadMin, spreadMax, exclusions);
                choices.push(choice);
                exclusions.pushArray($.range(choice - spacing, target + spacing));
            }

            choices.sort(function(a, b) { return a - b; });

            var choiceEls = $.cl('choice');
            var u = $.rand(2);
            var qFunc = u ? props.convert : qz.noConvert;
            var aFunc = u ? qz.noConvert : props.convert;

            $.id('query').setText(qFunc(target));
            $.id('oldUnit').setText(props.unitAbbrevs[u]);
            $.id('newUnit').setText(props.units[1 - u]);
            choices.forEach(function(choice, i) {
                choiceEls[i].setText(aFunc(choice) + props.unitAbbrevs[1 - u]);
                choiceEls[i].value = choice;
                
                choiceEls[i].onclick = function() {
                    this.classList.add('selected');
                    $.id('quiz').classList.add('answered');

                    choiceEls.forEach(function(el) {
                        if (el.value === target)
                            el.classList.add('winner');
                        else
                            el.classList.add('loser');
                    });
                }
            });
            
            $.id('quiz').style.opacity = 1;
        }, 400);
    },
    getChoices: function(quiz) {
        var spreadSize = Math.round((quiz.max - quiz.min) * qz.spreadMultiplier);
        var spreadMin = $.rand(quiz.min, quiz.max - spreadSize);
        var spreadMax = spreadMin + spreadSize;

        var choices = [];
        var exclusions = [];
        var spacingSize = Math.round((quiz.max - quiz.min) * qz.spacingMultiplier);
        $.range(4).forEach(function() {
            var choice = $.randExclude(spreadMin, spreadMax, exclusions);
            choices.push(choice);
            exclusions.pushArray($.range(choice - spacingSize, choice + spacingSize));
        });

        choices.numSort();
        return choices;
    },
    start: function() {
        this.newQuestion(this.quizzes[0]);
    }
};