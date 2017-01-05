angular.module(
    'common.svg.svg-zpd.directive',
    [
        'common.utility.svgpanzoom.service'
    ]
).directive('svgZpd', SvgZpd);

SvgZpd.$inject = ['svgpanzoom'];

function SvgZpd(svgpanzoom) {
    'use strict';
    return {
        replace: true,
        restrict: 'AE',
        transclude: true,
        scope: {
            imageWidth: '=',
            imageHeight: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.$on('maindiagram:externalzoom', function (event, zoom) {
                if (zoom === 1) {
                    $scope.paper.canvas.zoomIn();
                } else if (zoom === -1) {
                    $scope.paper.canvas.zoomOut();
                } else if (zoom === 0) {
                    $scope.paper.canvas.fit();
                    $scope.paper.canvas.center();
                    $scope.paper.canvas.zoomAtPoint($scope.paper.aspectratio, {x: 0, y: 0});
                } else {
                    $scope.paper.canvas.fit();
                    $scope.paper.canvas.center();
                    $scope.paper.canvas.zoomAtPoint($scope.paper.aspectratio, {x: 0, y: 0});
                    $scope.paper.canvas.zoom(zoom / 100);
                }
            });
        }],
        templateNamespace: 'svg',
        templateUrl: '/common/svg/svg-zpd.directive.html',
        link: function (scope) {
            scope.paper = {
                canvas: svgpanzoom('#deviceSelect', {
                            zoomEnabled: true,
                            controlIconsEnabled: true,
                            fit: true,
                            center: true,
                            minZoom: 0.1,
                            onZoom: function (zoomFactor) {
                                scope.$broadcast('maindiagram:zoomed', zoomFactor);
                                scope.$emit('maindiagram:zoomed', zoomFactor);
                            }
                        })
            };
            scope.paper.aspectratio = 0.1;
            scope.divWidth = 600;
            scope.divHeight = 400;
            scope.$watch('imageWidth', function () {
                if (scope.imageWidth !== undefined) {
                    if (scope.divWidth / scope.imageWidth < scope.divHeight / scope.imageHeight) {
                        scope.paper.aspectratio = scope.divWidth / scope.imageWidth;
                    } else {
                        scope.paper.aspectratio = scope.divHeight / scope.imageHeight;
                    }
                    scope.paper.aspectratio = Math.round(scope.paper.aspectratio * 100) / 100;
                    scope.paper.canvas.fit();
                    scope.paper.canvas.center();
                    scope.paper.canvas.zoomAtPoint(scope.paper.aspectratio, {x: 0, y: 0});
                }
            });
        }
    };
}
