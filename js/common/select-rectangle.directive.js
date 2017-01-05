angular
.module(
    'common.svg.select-rectangle.directive',
    ['common.utility.snapsvg.service']
)
.directive('selectRectangle', SelectRectangle);

SelectRectangle.$inject = ['snapsvg'];

function SelectRectangle (Snap) {
    'use strict';
    return {
        replace: true,
        restrict: 'E',
        scope: {
            x: '=',
            y: '=',
            width: '=',
            height: '=',
            dragMaxX: '@',
            dragMaxY: '@',
            minWidth: '@?',
            minHeight: '@?',
            isActive: '='
        },
        templateNamespace: 'svg',
        templateUrl: '/common/svg/select-rectangle.directive.html',
        link: function (scope, element) {
            var selectRectangle = Snap(element[0]);
            var cursor = 'move';
            if (scope.minWidth === undefined) {
                scope.minWidth = 5;
            }
            if (scope.minHeight === undefined) {
                scope.minHeight = 5;
            }
            var dragEnd = function(event) {
                this.dragging = false;
                event.stopPropagation();
            };
            var dragStart = function(x, y, event) {
                this.ox = scope.x;
                this.oy = scope.y;
                this.ow = scope.width;
                this.oh = scope.height;
                this.dragging = true;
                cursor = angular.element(event.target).attr('cursor');
                event.stopPropagation();
            };
            var checkAndResetX = function (rect, dx) {
                if (rect.ox + dx < 0) {
                    scope.x = 0;
                }
            };
            var checkAndResetY = function (rect, dy) {
                if (rect.oy + dy < 0) {
                    scope.y = 0;
                }
            };
            var checkAndResetWidth = function (rect, dx) {
                if (rect.ox + dx + rect.ow > scope.dragMaxX) {
                    scope.width = rect.ow;
                }
            };
            var checkAndResetHeight = function (rect, dy) {
                if (rect.oy + dy + rect.oh > scope.dragMaxY) {
                    scope.height = rect.oh;
                }
            };
            var dragMove = function(dx, dy, event) {
                switch (cursor) {
                    case 'nw-resize' :
                        checkAndResetX(this, dx);
                        checkAndResetY(this, dy);
                        if ((scope.x > 0 && scope.y > 0) || (this.ox + dx > 0 && this.oy + dy > 0)) {
                            scope.x = this.ox + dx;
                            scope.y = this.oy + dy;
                            scope.width = this.ow - dx;
                            scope.height = this.oh - dy;
                        }
                        break;
                    case 'ne-resize' :
                        checkAndResetY(this, dy);
                        checkAndResetWidth(this, dx);
                        if ((scope.y > 0 && scope.x + scope.width <= scope.dragMaxX) ||
                            (this.oy + dy > 0 && this.ox + this.ow + dx <= scope.dragMaxX)) {
                            scope.y = this.oy + dy;
                            scope.width = this.ow + dx;
                            scope.height = this.oh - dy;
                        }
                        break;
                    case 'se-resize' :
                        checkAndResetWidth(this, dx);
                        checkAndResetHeight(this, dy);
                        if ((scope.x + scope.width <= scope.dragMaxX && scope.y + scope.height <= scope.dragMaxY) ||
                            (this.ox + this.ow + dx <= scope.dragMaxX && this.oy + this.oh + dy <= scope.dragMaxY)) {
                            scope.width = this.ow + dx;
                            scope.height = this.oh + dy;
                        }
                        break;
                    case 'sw-resize' :
                        checkAndResetX(this, dx);
                        checkAndResetHeight(this, dy);
                        if ((scope.x > 0 && scope.y + scope.height <= scope.dragMaxY) ||
                            (this.ox + dx > 0 && this.oy + this.oh + dy <= scope.dragMaxY)) {
                            scope.x = this.ox + dx;
                            scope.width = this.ow - dx;
                            scope.height = this.oh + dy;
                        }
                        break;
                    case 'n-resize' :
                        checkAndResetY(this, dy);
                        if ((scope.y > 0) || (this.oy + dy > 0)) {
                            scope.y = this.oy + dy;
                            scope.height = this.oh - dy;
                        }
                        break;
                    case 's-resize' :
                        checkAndResetHeight(this, dy);
                        if ((scope.y + scope.height <= scope.dragMaxY) || (this.oy + this.oh + dy <= scope.dragMaxY)) {
                            scope.height = this.oh + dy;
                        }
                        break;
                    case 'e-resize' :
                        checkAndResetWidth(this, dx);
                        if ((scope.x + scope.width <= scope.dragMaxX) || (this.ox + this.ow + dx <= scope.dragMaxX)) {
                            scope.width = this.ow + dx;
                        }
                        break;
                    case 'w-resize' :
                        checkAndResetX(this, dx);
                        if ((scope.x > 0) || (this.ox + dx > 0)) {
                            scope.x = this.ox + dx;
                            scope.width = this.ow - dx;
                        }
                        break;
                    default :
                        if (this.ox + dx + this.ow > scope.dragMaxX) {
                            scope.x = scope.dragMaxX - scope.width;
                        }
                        if (this.oy + dy + this.oh > scope.dragMaxY) {
                            scope.y = scope.dragMaxY - scope.height;
                        }
                        if (this.ox + dx < 0) {
                            scope.x = 0;
                        }
                        if (this.oy + dy < 0) {
                            scope.y = 0;
                        }
                        if (!(this.ox + dx + this.ow > scope.dragMaxX || this.oy + dy + this.oh > scope.dragMaxY)) {
                            if (!(this.ox + dx < 0 || this.oy + dy < 0)) {
                                scope.x = this.ox + dx;
                                scope.y = this.oy + dy;
                            }
                        }
                        break;
                }
                // minimum height and width of rectangle
                if (scope.width < scope.minWidth) {
                    scope.width = parseInt(scope.minWidth);
                }
                if (scope.height < scope.minHeight) {
                    scope.height = parseInt(scope.minHeight);
                }
                scope.$apply();
                if (typeof(event.stopPropagation) === 'function') {
                    event.stopPropagation();
                }
            };
            if (scope.isActive) {
                selectRectangle.drag(dragMove, dragStart, dragEnd);
            }
        }
    };
}
