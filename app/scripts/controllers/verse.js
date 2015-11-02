'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:VerseCtrl
 * @description
 * # VerseCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('VerseCtrl', function ($scope, $timeout, $interval, VerseDataStore, VerseBlock) {

    var versePieces = null;
    var narrativeTimer = null;
    var siteContentElement = angular.element(document.querySelector('#content'));
    var inputField = document.querySelector('.view-verse input');

    init();

    /**
     * Initializes controller
     */
    function init() {
      // Load random verse
      VerseDataStore.getRandomVerse().then(function(verse){
        // Load all the content of the verse
        return verse.loadContent();
      }).then(function(verse){
        versePieces = verse.getPieces({});

        // Add event listeners
        $scope.$on('$destroy', onDestroy);
        siteContentElement.bind('click', onSiteContentClick);

        // Populate scope
        $scope.verse = verse;
        $scope.versePieces = [];
        $scope.currentBlock = null;
        $scope.onInputFieldKeyup = onInputFieldKeyup;

        // Start narrative
        continueNarrative();
      }).catch(function(e){
        console.log(e);
      });
    }

    /**
     * Continues verse output
     */
    function continueNarrative() {
      if (angular.isDefined(narrativeTimer)) {
        $interval.cancel(narrativeTimer);
      }

      narrativeTimer = $interval(displayNextVersePiece, 100);
    }

    /**
     * Stops verse output
     */
    function stopNarrative() {
      if (angular.isDefined(narrativeTimer)) {
        $interval.cancel(narrativeTimer);
        narrativeTimer = null;
      }
    }

    /**
     * Getting next piece of verse and displaying it based on its type
     */
    function displayNextVersePiece() {
      var nextPiece = versePieces.shift();

      // Exit, if no pieces left
      if (!angular.isDefined(nextPiece)) {
        return stopNarrative();
      }

      // Need to stop narrative, if that's a block
      if (nextPiece instanceof VerseBlock) {
        stopNarrative();
        $scope.currentBlock = nextPiece;

        // Focus to input field
        $timeout(function(){
          inputField.focus(); // not working in Mobile Safari. Maybe somebody know some WORKING method?
        }, 100);
        inputField.value = '';
      } else {
        // Display that piece
        $scope.versePieces.push(nextPiece);
      }
    }

    /**
     * Callback firing on input field keyup
     */
    function onInputFieldKeyup() {
      // Check entered value match block value
      if ($scope.currentBlock.match(inputField.value, 3)) {
        // Display that piece
        var nextPiece = $scope.currentBlock;
        $scope.currentBlock = null;
        $scope.versePieces.push(nextPiece);

        inputField.value = '';
        continueNarrative();
      }
    }

    /**
     * Callback firing when user clicks on site content area
     * @param {Event} event
     */
    function onSiteContentClick(event) {
      // Prevent default unnecessary behavior
      event.stopPropagation();
      event.preventDefault();

      // Focus on input field
      inputField.focus(); // mostly for Mobile Safari
    }

    /**
     * Callback firing on scope/controller destruction
     */
    function onDestroy() {
      // Unbind global events to prevent memory leaks
      siteContentElement.unbind('click', onSiteContentClick);
    }
  });
