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
            var q, a;
            var u = $.rand(2);
            if (u === 0) {
                q = function(x) { return x; };
                a = props.convert;
            }
            else {
                q = props.convert;
                a = function(x) { return x; };
            }

            $.id('query').setText(q(target));
            $.id('oldUnit').setText(props.unitAbbrevs[u]);
            $.id('newUnit').setText(props.units[1 - u]);
            answers.forEach(function(ans, i) {
                ansEls[i].setText(a(ans) + props.unitAbbrevs[1 - u]);
                
                if (ans === target)
                    ansEls[i].classList.add('winner');
                else
                    ansEls[i].classList.add('loser');
                
                ansEls[i].onclick = function() {
                    ansEls.forEach(function(el, i) {
                        el.classList.add('answered');
                    });
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