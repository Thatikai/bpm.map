
angular
.module(
    'common.utility.svgpanzoom.service',
    [
        'SvgPanZoom'
    ]
)
.service('svgpanzoom', SvgPanZoomService);

SvgPanZoomService.$inject = ['$window'];

function SvgPanZoomService ($window) {
    'use strict';
    if (!$window.svgPanZoom) {
        throw new Error('SvgPanZoom MUST BE DEFINED ON $window !!!');
    }
    return $window.svgPanZoom;
}
