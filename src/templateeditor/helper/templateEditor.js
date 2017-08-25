var scope1;
var dragElement;
var hist;
(function (angular, $, _) {
    "use strict";

    angular
            .module("Cerberus.TemplateEditor")
            .service("Cerberus.TemplateEditor.Helper.TemplateEditor", [
                 "Cerberus.TemplateEngine.Service.Event",
                TemplateEditorHelper
            ]);

    function TemplateEditorHelper( EventService) {
        // Properties that are not on this list will be stripped away
        // TODO: Refactor into Cerberus.TemplateEditor.Helper.CSS
        // TODO: Use hashmap instead to reduce lookup time
        var validProperties = [
            "display",
            "left",
            "right",
            "top",
            "bottom",
            "width",
            "height",
            "opacity",
            "font-family",
            "font-size",
            "font-style",
            "font-weight",
            "text-decoration",
            "color",
            "min-height",
            "min-width",
            "transform",
            "overflow",
            "word-spacing",
            "text-align",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
            "border-top-style",
            "border-top-width",
            "border-top-color",
            "border-right-style",
            "border-right-width",
            "border-right-color",
            "border-bottom-style",
            "border-bottom-width",
            "border-bottom-color",
            "border-left-style",
            "border-left-width",
            "border-left-color",
            "border-top-left-radius",
            "border-top-right-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius",
            "background-color",
            "background-image",
            "background-repeat",
            "background-size",
            "background-position-x",
            "background-position-y",
            "text-shadow",
            "box-shadow",
            "white-space",
            "transform-origin",
            "z-index"
        ];
        $.ui.plugin.add("draggable", "smartguides", {
            start: function (event, ui) {
                var i = $(this).data("ui-draggable"), o = i.options;
                i.elements = [];
                $(o.smartguides.constructor != String ? (o.smartguides.items || ':data(ui-draggable)') : o.smartguides).each(function () {
                    var $t = $(this);
                    var $o = $t.offset();
                    if (this != i.element[0])
                        i.elements.push({
                            item: this,
                            width: $t.outerWidth(), height: $t.outerHeight(),
                            top: $o.top, left: $o.left
                        });
                });
            },
            stop: function (event, ui) {
                //$(".objectx").css({"display":"none"});
                //$(".objecty").css({"display":"none"});
            },
            drag: function (event, ui) {
                var inst = $(this).data("ui-draggable"), o = inst.options;
                var d = o.tolerance;
                $(".objectx").css({"display": "none"});
                $(".objecty").css({"display": "none"});
                var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
                        y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height,
                        xc = (x1 + x2) / 2, yc = (y1 + y2) / 2;
                for (var i = inst.elements.length - 1; i >= 0; i--) {
                    var l = inst.elements[i].left, r = l + inst.elements[i].width,
                            t = inst.elements[i].top, b = t + inst.elements[i].height,
                            hc = (l + r) / 2, vc = (t + b) / 2;
                    var lss = Math.abs(l - x1) <= d;
                    var ls = Math.abs(l - x2) <= d;
                    var rss = Math.abs(r - x2) <= d;
                    var rs = Math.abs(r - x1) <= d;
                    var tss = Math.abs(t - y1) <= d;
                    var ts = Math.abs(t - y2) <= d;
                    var bss = Math.abs(b - y2) <= d;
                    var bs = Math.abs(b - y1) <= d;
                    var hs = Math.abs(hc - xc) <= d;
                    var vs = Math.abs(vc - yc) <= d;
                    if (lss) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: l}).left - inst.margins.left;
                        $(".objectx").css({"left": ui.position.left, "display": "block"});
                    }
                    if (rss) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: r - inst.helperProportions.width}).left - inst.margins.left;
                        $(".objectx").css({"left": ui.position.left + ui.helper.width(), "display": "block"});
                    }
                    if (ls) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: l - inst.helperProportions.width}).left - inst.margins.left;
                        $(".objectx").css({"left": ui.position.left + ui.helper.width(), "display": "block"});
                    }
                    if (rs) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: r}).left - inst.margins.left;
                        $(".objectx").css({"left": ui.position.left, "display": "block"});
                    }
                    if (tss) {
                        ui.position.top = inst._convertPositionTo("relative", {top: t, left: 0}).top - inst.margins.top;
                        $(".objecty").css({"top": ui.position.top, "display": "block"});
                    }
                    if (ts) {
                        ui.position.top = inst._convertPositionTo("relative", {top: t - inst.helperProportions.height, left: 0}).top - inst.margins.top;
                        $(".objecty").css({"top": ui.position.top + ui.helper.height(), "display": "block"});
                    }
                    if (bss) {
                        ui.position.top = inst._convertPositionTo("relative", {top: b - inst.helperProportions.height, left: 0}).top - inst.margins.top;
                        $(".objecty").css({"top": ui.position.top + ui.helper.height(), "display": "block"});
                    }
                    if (bs) {
                        ui.position.top = inst._convertPositionTo("relative", {top: b, left: 0}).top - inst.margins.top;
                        $(".objecty").css({"top": ui.position.top, "display": "block"});
                    }
                    if (hs) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: hc - inst.helperProportions.width / 2}).left - inst.margins.left;
                        $(".objectx").css({"left": ui.position.left + (ui.helper.width() / 2), "display": "block"});
                    }
                    if (vs) {
                        ui.position.top = inst._convertPositionTo("relative", {top: vc - inst.helperProportions.height / 2, left: 0}).top - inst.margins.top;
                        $(".objecty").css({"top": ui.position.top + (ui.helper.height() / 2), "display": "block"});
                    }


                }
                ;
            }
        });
        $.ui.plugin.add("draggable", "subSmartguides", {
            start: function (event, ui) {
                var i = $(this).data("ui-draggable"), o = i.options;
                i.elements = [];
                $(o.subSmartguides.constructor != String ? (o.subSmartguides.items || ':data(ui-draggable)') : o.subSmartguides).each(function () {
                    var $t = $(this);
                    var $o = $t.offset();
                    if (this != i.element[0])
                        i.elements.push({
                            item: this,
                            width: $t.outerWidth(), height: $t.outerHeight(),
                            top: $o.top, left: $o.left
                        });
                });
            },
            stop: function (event, ui) {
                //$(".sub-objectx").css({"display":"none"});
                //$(".sub-objecty").css({"display":"none"});
            },
            drag: function (event, ui) {
                var inst = $(this).data("ui-draggable"), o = inst.options;
                var d = o.tolerance;
                $(".sub-objectx").css({"display": "none"});
                $(".sub-objecty").css({"display": "none"});
                var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
                        y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height,
                        xc = (x1 + x2) / 2, yc = (y1 + y2) / 2;
                for (var i = inst.elements.length - 1; i >= 0; i--) {
                    var l = inst.elements[i].left, r = l + inst.elements[i].width,
                            t = inst.elements[i].top, b = t + inst.elements[i].height,
                            hc = (l + r) / 2, vc = (t + b) / 2;
                    var lss = Math.abs(l - x1) <= d;
                    var ls = Math.abs(l - x2) <= d;
                    var rss = Math.abs(r - x2) <= d;
                    var rs = Math.abs(r - x1) <= d;
                    var tss = Math.abs(t - y1) <= d;
                    var ts = Math.abs(t - y2) <= d;
                    var bss = Math.abs(b - y2) <= d;
                    var bs = Math.abs(b - y1) <= d;
                    var hs = Math.abs(hc - xc) <= d;
                    var vs = Math.abs(vc - yc) <= d;
                    if (lss) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: l}).left - inst.margins.left;
                        $(".sub-objectx").css({"left": ui.position.left, "display": "block"});
                    }
                    if (rss) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: r - inst.helperProportions.width}).left - inst.margins.left;
                        $(".sub-objectx").css({"left": ui.position.left + ui.helper.width(), "display": "block"});
                    }
                    if (ls) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: l - inst.helperProportions.width}).left - inst.margins.left;
                        $(".sub-objectx").css({"left": ui.position.left + ui.helper.width(), "display": "block"});
                    }
                    if (rs) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: r}).left - inst.margins.left;
                        $(".sub-objectx").css({"left": ui.position.left, "display": "block"});
                    }
                    if (tss) {
                        ui.position.top = inst._convertPositionTo("relative", {top: t, left: 0}).top - inst.margins.top;
                        $(".sub-objecty").css({"top": ui.position.top, "display": "block"});
                    }
                    if (ts) {
                        ui.position.top = inst._convertPositionTo("relative", {top: t - inst.helperProportions.height, left: 0}).top - inst.margins.top;
                        $(".sub-objecty").css({"top": ui.position.top + ui.helper.height(), "display": "block"});
                    }
                    if (bss) {
                        ui.position.top = inst._convertPositionTo("relative", {top: b - inst.helperProportions.height, left: 0}).top - inst.margins.top;
                        $(".sub-objecty").css({"top": ui.position.top + ui.helper.height(), "display": "block"});
                    }
                    if (bs) {
                        ui.position.top = inst._convertPositionTo("relative", {top: b, left: 0}).top - inst.margins.top;
                        $(".sub-objecty").css({"top": ui.position.top, "display": "block"});
                    }
                    if (hs) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: hc - inst.helperProportions.width / 2}).left - inst.margins.left;
                        $(".sub-objectx").css({"left": ui.position.left + (ui.helper.width() / 2), "display": "block"});
                    }
                    if (vs) {
                        ui.position.top = inst._convertPositionTo("relative", {top: vc - inst.helperProportions.height / 2, left: 0}).top - inst.margins.top;
                        $(".sub-objecty").css({"top": ui.position.top + (ui.helper.height() / 2), "display": "block"});
                    }


                }
                ;
            }
        });
        /***************************************************************
         PRESENTATION LOGIC
         ***************************************************************/
        //TODO: Remove - should be handled by Cerberus.TemplateEditor.Helper.CSS
        function extractVisualProperties(style) {
            var result = [];
            var propertyName = "",
                    sanitizedPropertyName = "",
                    propertyValue = "";
//debugger;
            for (var i = 0, length = validProperties.length; i < length; i++) {
                if (['box-shadow', 'height', 'min-height'].indexOf(validProperties[i]) == -1 || 1 == 1) {
                    //console.log(validProperties[i])


                    propertyName = validProperties[i];
                    sanitizedPropertyName = propertyName.replace(/-([A-Z])/gi, function (v) {
                        return v[1].toUpperCase();
                    });

                    propertyValue = style[sanitizedPropertyName];

                    if (propertyValue !== "") {
                        result.push(String.format("{0}:{1}", propertyName, propertyValue));
                    }
                }
            }

            return result.join(";");
        }

        function storeDragResizeSettings(element) {
            var style = element.get(0).style;
            var isTransposedHorizontal = style.right.length > 0,
                    isTransposedVertical = style.bottom.length > 0,
                    horizontalUnitName = isTransposedHorizontal ? "right" : "left",
                    verticalUnitName = isTransposedVertical ? "bottom" : "top",
                    isWidthInPercent = !isNaN(parseInt(style.width)) && style.width.indexOf("%") >= 0,
                    isHeightInPercent = !isNaN(parseInt(style.height)) && style.height.indexOf("%") >= 0,
                    isHorizontalInPercent = !isNaN(parseInt(style[horizontalUnitName])) && style[horizontalUnitName].indexOf("%") >= 0,
                    isVerticalInPercent = !isNaN(parseInt(style[verticalUnitName])) && style[verticalUnitName].indexOf("%") >= 0;

            element.data("dragResizeSettings", {
                isTransposedHorizontal: isTransposedHorizontal,
                isTransposedVertical: isTransposedVertical,
                isHorizontalInPercent: isHorizontalInPercent,
                isVerticalInPercent: isVerticalInPercent,
                isWidthInPercent: isWidthInPercent,
                isHeightInPercent: isHeightInPercent
            });
        }

        function sanitizeDragValues(element) {
            // TODO: Clean up
            var nativeElement = element.get(0);
            var template = element.parent(),
                    templateWidth = template.width(),
                    templateHeight = template.height();

            var value,
                    horizontal = 0,
                    vertical = 0,
                    dragResizeSettings = element.data("dragResizeSettings"),
                    isTransposedVertical = dragResizeSettings.isTransposedVertical,
                    isTransposedHorizontal = dragResizeSettings.isTransposedHorizontal,
                    isHorizontalInPercent = dragResizeSettings.isHorizontalInPercent,
                    isVerticalInPercent = dragResizeSettings.isVerticalInPercent,
                    elementWidth = element.outerWidth(),
                    elementHeight = ~~element.outerHeight();

            //jQuery draggable can't handle positioning types other than left/top
            //Since left/top have higher priority than their transposed counterparts, we can set the values for the counterparts if needed
            //without any repercussions.

            //Horizontal Positioning
            if (isHorizontalInPercent || 1 == 1) {
                //Percentage based positioning
                horizontal = tryParseFloat(element.css("left"));
                element.css("left", String.format("{0}%", (100.0 * horizontal / templateWidth).toFixed(1)));

                if (isTransposedHorizontal) {
                    nativeElement.style.right = String.format("{0}%", 100 - 100.0 * (horizontal / templateWidth + elementWidth / templateWidth)).toFixed(1);
                }
                else {
                    nativeElement.style.right = "";
                }
            }
            else {
                //Pixel based positioning
                value = tryParseFloat(nativeElement.style.left);
                nativeElement.style.left = value + "px";

                if (isTransposedHorizontal) {
                    nativeElement.style.right = templateWidth - value - elementWidth + "px";
                }
                else {
                    nativeElement.style.right = "";
                }
            }

            //Vertical Positioning
            if (isVerticalInPercent) {
                //Percentage based positioning
                vertical = tryParseFloat(element.css("top"));
                element.css("top", String.format("{0}%", (100.0 * vertical / templateHeight).toFixed(1)));

                if (isTransposedVertical) {
                    nativeElement.style.bottom = String.format("{0}%", 100 - 100.0 * (vertical / templateHeight + elementHeight / templateHeight)).toFixed(1);
                }
                else {
                    nativeElement.style.bottom = "";
                }
            }
            else {
                //Pixel based positioning
                value = tryParseFloat(nativeElement.style.top);
                nativeElement.style.top = value + "px";

                if (isTransposedVertical) {
                    nativeElement.style.bottom = templateHeight - value - elementHeight + "px";
                }
                else {
                    nativeElement.style.bottom = "";
                }
            }
        }

        function sanitizeResizeValues(element) {
            var template = element.parent(),
                    templateWidth = template.width(),
                    templateHeight = template.height();

            var width = 0,
                    height = 0,
                    dragResizeSettings = element.data("dragResizeSettings"),
                    isWidthInPercent = dragResizeSettings.isWidthInPercent,
                    isHeightInPercent = dragResizeSettings.isHeightInPercent;

            //Dimensions
            if (isWidthInPercent || 1 == 1) {
                width = tryParseFloat(element.css("width"));
                element.css("width", String.format("{0}%", (100.0 * width / templateWidth).toFixed(1)));
            }

            if (isHeightInPercent) {
                height = tryParseFloat(element.css("height"));
                element.css("height", String.format("{0}%", (100.0 * height / templateHeight).toFixed(1)));
            }
        }

        this.updateVisualProperties = function (eventId, element) {
            console.log(eventId, 'evid');

            var scope = element.scope();

            scope1 = scope;
            var nativeElement = element.get(0);

            var removePropertyMethod = nativeElement.style.removeProperty ? nativeElement.style.removeProperty : nativeElement.style.removeAttribute;

            //resizable adds position:absolute even though it's already in the applied class
            removePropertyMethod.call(nativeElement.style, "position");
            if (scope.comp) {
                scope.comp.visualProperties = extractVisualProperties(nativeElement.style);
                EventService.notify(eventId, scope.comp);
            } else {
                console.log('else case')
                scope.component.visualProperties = extractVisualProperties(nativeElement.style);
                // EventService.notify(eventId, scope.component);
                HistoryService.commitSnapshot("resolution", scope.component.visualProperties);
                hist = HistoryService;
            }

        };
        this.enableSortable = function (componentElement) {

            //componentElement.parent().sortable();  
            $("cs-component").sortable();
        }
        this.enableDraggable = function (componentElement) {
            var self = this;
            var table = {};
            var selectedElements;

            componentElement
                    .draggable({
                        //  connectToSortable: "cs-component",
                        containment: ".edit-design",
                        //snap: ".grid",
                        tolerance: 5,
                        // snapTolerance: 10,
                        smartguides: ".grid",
                        start: function (e) {
                            var allowDrag = componentElement.hasClass("selected");

                            selectedElements = $("cs-component.selected");
                            componentElement.draggable("option", "snap");

                            if (allowDrag || 1 == 1) {
                                selectedElements
                                        .each(function () {
                                            var element = $(this);
                                            storeDragResizeSettings(element);

                                            table[this.id] = {
                                                startPosition: element.position()
                                            };
                                        })
                                        .addClass("ui-draggable-dragging");
                            }

                            return allowDrag;
                        },
                        drag: function (e, ui) {
                            var elementData,
                                    offsetLeft = ui.originalPosition.left - ui.position.left,
                                    offsetTop = ui.originalPosition.top - ui.position.top;

                            componentElement.draggable("option", "snap");

                            selectedElements.each(function () {
                                var element = $(this);

                                elementData = table[this.id];
                                element.css({
                                    left: elementData.startPosition.left - offsetLeft,
                                    top: elementData.startPosition.top - offsetTop
                                });

                                sanitizeDragValues(element);
                            });

                            // TODO: Optimize by reducing notification frequency
                            self.updateVisualProperties("ComponentUpdating", componentElement);
                        },
                        stop: function (e, ui) {
                            console.log('stp');
                            var dragResizeSettings = componentElement.data("dragResizeSettings"),
                                    offsetLeft = ui.originalPosition.left - ui.position.left,
                                    offsetTop = ui.originalPosition.top - ui.position.top,
                                    elementData;

                            selectedElements.each(function () {
                                var element = $(this);
                                var nativeElement = element.get(0);

                                elementData = table[this.id];
                                element.css({
                                    left: elementData.startPosition.left - offsetLeft,
                                    top: elementData.startPosition.top - offsetTop
                                });

                                sanitizeDragValues(element);

                                var removePropertyMethod = nativeElement.style.removeProperty ? nativeElement.style.removeProperty : nativeElement.style.removeAttribute;
                                var isTransposedHorizontal = dragResizeSettings.IsTransposedHorizontal;
                                var isTransposedVertical = dragResizeSettings.IsTransposedVertical;

                                removePropertyMethod.call(nativeElement.style, isTransposedHorizontal ? "left" : "right");
                                removePropertyMethod.call(nativeElement.style, isTransposedVertical ? "top" : "bottom");

                                delete nativeElement.style.right;

                                element.data("dragResizeSetting", undefined);
                            })
                                    .removeClass("ui-draggable-dragging");

                            self.updateVisualProperties("ComponentPositionUpdated", componentElement);
                        }
                    });
        };
        this.enableSubDraggable = function (componentElement) {
            var self = this;
            var table = {};
            var selectedElements;

            componentElement
                    .draggable({
                        //containment: "cs-component",
                        accept: "cs-component",
                        //snap: ".grid, cs-component",
                        subSmartguides: ".sub-grid",
                        tolerance: 5,
                        //snapTolerance: 10,
                        revert: 'invalid',
                        start: function (e) {
                            console.log('start')
                            var allowDrag = componentElement.hasClass("selected");

                            selectedElements = $("cs-sub-component.selected");
                            componentElement.draggable("option", "snap");

                            if (allowDrag) {
                                selectedElements
                                        .each(function () {
                                            var element = $(this);
                                            storeDragResizeSettings(element);

                                            table[this.id] = {
                                                startPosition: element.position()
                                            };
                                        })
                                        .addClass("ui-draggable-dragging");
                            }

                            return allowDrag;
                        },
                        drag: function (e, ui) {
                            console.log('drag')
                            var elementData,
                                    offsetLeft = ui.originalPosition.left - ui.position.left,
                                    offsetTop = ui.originalPosition.top - ui.position.top;

                            componentElement.draggable("option", "snap", e.ctrlKey);

                            selectedElements.each(function () {
                                var element = $(this);
                                dragElement = element;
                                elementData = table[this.id];
                                element.css({
                                    left: elementData.startPosition.left - offsetLeft,
                                    top: elementData.startPosition.top - offsetTop
                                });

                                sanitizeDragValues(element);
                            });

                            // TODO: Optimize by reducing notification frequency
                            // self.updateVisualProperties("ComponentUpdating", componentElement);
                        },
                        stop: function (e, ui) {
                            console.log('stp');
                            var dragResizeSettings = componentElement.data("dragResizeSettings"),
                                    offsetLeft = ui.originalPosition.left - ui.position.left,
                                    offsetTop = ui.originalPosition.top - ui.position.top,
                                    elementData;

                            selectedElements.each(function () {
                                var element = $(this);
                                var nativeElement = element.get(0);

                                elementData = table[this.id];
                                element.css({
                                    left: elementData.startPosition.left - offsetLeft,
                                    top: elementData.startPosition.top - offsetTop
                                });

                                sanitizeDragValues(element);

                                var removePropertyMethod = nativeElement.style.removeProperty ? nativeElement.style.removeProperty : nativeElement.style.removeAttribute;
                                var isTransposedHorizontal = dragResizeSettings.IsTransposedHorizontal;
                                var isTransposedVertical = dragResizeSettings.IsTransposedVertical;

                                removePropertyMethod.call(nativeElement.style, isTransposedHorizontal ? "left" : "right");
                                removePropertyMethod.call(nativeElement.style, isTransposedVertical ? "top" : "bottom");

                                delete nativeElement.style.right;

                                element.data("dragResizeSetting", undefined);
                            })
                                    .removeClass("ui-draggable-dragging");

                            //self.updateVisualProperties("ComponentPositionUpdated", componentElement);
                        }
                    });
        };
        this.enableResizable = function (element) {
            var self = this;
            element.resizable({
                handles: 'n,e,s,w,ne,nw,se,sw',
                start: function () {
                    storeDragResizeSettings(element);
                },
                resize: function () {
                    sanitizeResizeValues(element);
                    self.updateVisualProperties("ComponentUpdating", element);
                },
                stop: function () {
                    sanitizeResizeValues(element);
                    element.data("dragResizeSetting", undefined);
                    self.updateVisualProperties("ComponentSizeUpdated", element);
                }
            });
        };
        this.enableSubResizable = function (element) {
            var self = this;
            element.resizable({
                handles: 'n,e,s,w,ne,nw,se,sw',
                start: function () {
                    storeDragResizeSettings(element);
                },
                resize: function () {
                    sanitizeResizeValues(element);
                    // self.updateVisualProperties("ComponentUpdating", element);
                },
                stop: function () {
                    sanitizeResizeValues(element);
                    element.data("dragResizeSetting", undefined);
                    //self.updateVisualProperties("ComponentSizeUpdated", element);
                }
            });
        };
        /***************************************************************
         BUSINESS LOGIC
         TODO: Refactor into separate service
         ***************************************************************/
        this.remapComponentVisualProperties = function (template, resolution) {
            _.forEach(template.components, function (component) {
                component.visualProperties = resolution.componentVisualProperties[component.id] || "";
            });
        };

        this.setComponentVisualProperties = function (template, resolution, component, populateIfNeeded) {
            var hasComponent = resolution.componentVisualProperties[component.id] !== undefined;

            resolution.componentVisualProperties[component.id] = component.visualProperties;

            if (!hasComponent && populateIfNeeded) {
                //there was no visualproperties available for this specific component so we add it
                _.forEach(template.resolutions, function (res) {
                    res.componentVisualProperties[component.id] = component.visualProperties;
                });
            }
        };

        this.removeComponentsFromTemplate = function (template, components) {
            _.forEach(components, function (component) {
                _.remove(template.components, {id: component.id});
                _.forEach(template.resolutions, function (resolution) {
                    delete resolution.componentVisualProperties[component.id];
                });
            });
        };
    }
})(window.angular, window.jQuery, window._);