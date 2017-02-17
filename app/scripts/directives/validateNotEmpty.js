/**
 * Directive created due to the attribute  required in input tag
 * set the input as error at the begining. Probably in the future
 * we could replace this just with the required attribute.  
 * @ngdoc directive
 * @name clientApp.directive:sameAs
 * @description
 * # sameAs
 */
angular.module('tunariApp')
  .directive('validateNotEmpty', function () {
    return {
    	require: ['ngModel', '^form'],
    	link: function(scope, element, attrs, ctrls) {   
        self = this;     
        var model = attrs.ngModel;     
        var ngModelCtrl = ctrls[0];
        var parentForm = ctrls[1];
      
        var parentFormSubmit = function() {
          return parentForm && parentForm.$submitted;
        }; 

        function isValidValue() {
          var modelNotExists = scope[model] === "" || scope[model] === undefined;
          var isInValid = (modelNotExists && ngModelCtrl.$touched) || (modelNotExists && (parentForm && parentForm.$submitted));
          var isValid = !isInValid;          
          return isValid;
        }; 

        scope.$watch(model, function(){            
            var isValid = isValidValue();
                               
            ngModelCtrl.$setValidity('empty', isValid);                        
        });  

        scope.$watch(parentFormSubmit, function(){            
            var isValid = isValidValue();                                
            ngModelCtrl.$setValidity('empty', isValid);                        
        });
    	}
    };
  });