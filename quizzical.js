var qz = function() {
    var quizzes = [
        {
            name: 'Temperature',
            units: ['Celsius', 'Fahrenheit'],
            unitAbbrevs: ['°C', '°F'],
            convert: function(c) { return Math.round((c * 9 / 5) + 32); },
            min: -50,
            max: 120
        }
    ];

    var spacingMultiplier = .02;
    var spreadMultiplier = .05;

    function noConvert(x) { return x; }

    function newQuestion(props) {
        $.id('quiz').style.opacity = 0;

        // use setTimeout to give the fade out time to act
        setTimeout(function() {
            var target = $.rand(props.min, props.max);

            var spacing = Math.round(spacingMultiplier * (props.max - props.min));
            var choices = [target];
            var exclusions = $.range(target - spacing, target + spacing);

            var spread = Math.round(spreadMultiplier * (props.max - props.min));
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
            var qFunc = u ? props.convert : noConvert;
            var aFunc = u ? noConvert : props.convert;

            $.id('query').setText(qFunc(target));
            $.id('oldUnit').setText(props.unitAbbrevs[u]);
            $.id('newUnit').setText(props.units[1 - u]);
            choices.forEach(function(choice, i) {
                choiceEls[i].setText(aFunc(choice) + props.unitAbbrevs[1 - u]);
                
                if (choice === target)
                    choiceEls[i].classList.add('winner');
                else
                    choiceEls[i].classList.add('loser');
                
                choiceEls[i].onclick = function() {
                    this.classList.add('selected');
                    $.id('quiz').classList.add('answered');
                }
            });
            
            $.id('quiz').style.opacity = 1;
        }, 400);
    }

    function _start() {
        newQuestion(quizzes[0]);
    }

    return {
        start: _start
    };
}();