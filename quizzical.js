var q = function() {
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

    var question = 'What is {0}{1} in <span class="unit">{2}</span>?'
    var spacingMultiplier = .02;
    var spreadMultiplier = .2;

    function newQuestion(props) {
        $.id('quiz').style.opacity = 0;

        // use setTimeout to give the fade out time to act
        setTimeout(function() {
            var target = $.rand(props.min, props.max);

            var spacing = Math.round(spacingMultiplier * (props.max - props.min));
            var answers = [target];
            var exclusions = $.range(target - spacing, target + spacing);

            var spread = Math.round(spreadMultiplier * props.max - props.min));
            var spreadMin = target - spread;
            var spreadMax = target + spread;

            for (var i = 0; i < 3; i++) {
                var ans = $.randExclude(spreadMin, spreadMax, exclusions);
                answers.push(ans);
                exclusions.push([ans - spacing, target + spacing]);
            }

            if ($.rand(2) === 0) {
                $.id('question').innerHTML = question.format(target, props.unitAbbrevs[0], props.units[1]);
            }
            else {
                $.id('question').innerHTML = question.format(props.convert(target), props.unitAbbrevs[1], props.units[0]);
            }

            answers.sort(function(a, b) { return a - b; });
            $.test(answers[0], function() { return true; });
            $.test(answers[1], function() { return true; });
            $.test(answers[2], function() { return true; });
            $.test(answers[3], function() { return true; });
            
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