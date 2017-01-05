(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('components.svg', [
            'SvgPanZoom'
        ])
        .component('svgMap', {
            templateUrl: '/js/components/svgComponent.html',
            controller: SvgMapController,
            transclude: true,
            bindings: {
            },
        });

    function SvgMapController() {
        var ctrl = this;
    }
})();