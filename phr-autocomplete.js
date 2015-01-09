'use strict';
// An AngularJS directive (optional; for use if you are using AngularJS)
if (typeof angular !== 'undefined') {
  angular.module('autocompPhr', [])

    .constant('phrAutocompleteConfig', {})

    .directive('phrAutocomplete', ['phrAutocompleteConfig', '$timeout', function (phrAutocompleteConfig, $timeout) {
      'use strict';
      var options;
      options = {};
      angular.extend(options, phrAutocompleteConfig);
      return {
        scope: {
          modelData: '=ngModel'
        },
        require:'?ngModel',
        link:function (scope, element, attrs, controller) {
          var getOptions = function () {
            // Because we created our own scope, we have to evaluate
            // attrs.phrAutocomplete in the parent scope.
            return angular.extend({}, phrAutocompleteConfig, scope.$parent.$eval(attrs.phrAutocomplete));
          };

          var initWidget = function () {
            var opts = getOptions();

            // If we have a controller (i.e. ngModelController) then wire it up
            if (controller) {
              var itemText = [];
              var itemTextToItem = {};
              var itemLabel;
              for (var i=0, len=opts.source.length; i<len; ++i) {
                var item = opts.source[i];
                itemLabel = item.label;
                itemText[i] = itemLabel;
                itemTextToItem[itemLabel] = item;
              }
              var phrAutoOpts = {matchListValue: !opts.allowFreeText}

              // Set the default value, if there is one
              var defaultIndex = -1;
              if (opts.selectFirst)
                defaultIndex = 0;
              else if (opts.preSelected !== undefined)
                defaultIndex = opts.preSelected;
              if (defaultIndex >= 0) {
                itemLabel = itemText[defaultIndex];
                phrAutoOpts.defaultValue = itemLabel;
              }

              var pElem = element[0];
              // The autocompleter uses the ID attribute of the element. If pElem
              // does not have an ID, give it one.
              if (pElem.id === '') {
                // In this case just make up an ID.
                if (!Def.Autocompleter.lastGeneratedID_)
                  Def.Autocompleter.lastGeneratedID_ = 0;
                pElem.id = 'ac' + ++Def.Autocompleter.lastGeneratedID_;
              }

              var ac = new Def.Autocompleter.Prefetch(pElem.id, itemText, phrAutoOpts);
              Def.Autocompleter.Event.observeListSelections(pElem.name, function(eventData) {
                scope.$apply(function() {
                  var finalVal = eventData.final_val;
                  var item = itemTextToItem[finalVal] ||
                    {value: finalVal, id: finalVal, label: finalVal};
                  controller.$setViewValue(item);
                });
              });

              // Add a parser to convert from the field value to the object
              // containing value and (e.g.) code.
              controller.$parsers.push(function(value) {
                var rtn = value;
                if (typeof value === 'string') {
                  rtn = itemTextToItem[value];
                }
                return rtn;
              });
              // Also add a formatter to get the display string if the model is
              // changed.
              controller.$formatters.push(function(value) {
                var rtn = value;
                if (typeof value === 'object')
                  rtn = value.label;
                return rtn;
              });

              // if we have a default value, go ahead and select it
              if (defaultIndex >=0) {
                scope.modelData = opts.source[defaultIndex];
              }
            } // if controller
          };

          // Run initWiget once after the name attribute has been filled in
          scope.$watch({}, initWidget, true); // i.e. run once
        }
      };
    }]
  );
}