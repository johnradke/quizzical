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

            var spread = Math.round(spreadMultiplier * (props.max - props.min));
            var spreadMin = target - spread;
            var spreadMax = target + spread;

            for (var i = 0; i < 3; i++) {
                var ans = $.randExclude(spreadMin, spreadMax, exclusions);
                answers.push(ans);
                exclusions.pushArray($.range(ans - spacing, target + spacing));
            }

            answers.sort(function(a, b) { return a - b; });

            var ansEls = $.cl('answer');
            if ($.rand(2) === 0) {
                $.id('query').setText(target);
                $.id('oldUnit').setText(props.unitAbbrevs[0]);
                $.id('newUnit').setText(props.units[1]);
                answers.forEach(function(ans, i) {
                    ansEls[i].setText(props.convert(ans) + props.unitAbbrevs[1]);
                });
            }
            else {
                $.id('query').setText(props.convert(target));
                $.id('oldUnit').setText(props.unitAbbrevs[1]);
                $.id('newUnit').setText(props.units[0]);
                answers.forEach(function(ans, i) {
                    ansEls[i].setText(ans + props.unitAbbrevs[0]);
                });
            }
            
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