'use strict';

describe('Service: Verse', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  var Verse;
  var $httpBackend;
  var verse; // instance of concrete verse

  var mockVerseData = {
    'name': 'test_name',
    'title': 'Test title',
    'description': 'Test description',
    'authorName': 'test_author'
  };

  beforeEach(inject(function ($injector, _Verse_) {
    // Mock backend with $httpBackend
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('i18n/en.json').respond('');
    $httpBackend.whenGET('i18n/ru.json').respond('');

    Verse = _Verse_;
  }));

  beforeEach(function(){
    // Init actual verse
    verse = new Verse(mockVerseData);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be properly initialized', function () {
    expect(!!verse).toBe(true);
    expect(verse.name).toBe(mockVerseData.name);
    expect(verse.title).toBe(mockVerseData.title);
    expect(verse.description).toBe(mockVerseData.description);
    expect(verse.authorName).toBe(mockVerseData.authorName);
    expect(verse.path).toBe([verse.PATH_BASE, verse.authorName, 'verses', verse.name].join('/'));
    expect(verse.url).toBe([verse.URL_BASE, verse.authorName, verse.name].join('/'));

    $httpBackend.flush();
  });

  it('should load its content', function () {
    var mockVerseContent = 'Test content';
    $httpBackend.expectGET(verse.path + '/content.txt').respond(mockVerseContent);

    verse.loadContent().then(function(){
      expect(verse.content).toBe(mockVerseContent);
    });

    $httpBackend.flush();
  });

  it('should trim content on load', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('\t\n content\n\content\r\n');

    verse.loadContent().then(function(){
      expect(verse.content.length).toBe(15);
    });

    $httpBackend.flush();
  });

  it('should replace hyphens to proper dashes (typography)', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content-content content -content content - content');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content-content content —content content — content');
    });

    $httpBackend.flush();
  });

  it('should cleanup content from non-Unix line breaks', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content\r\ncontent\rcontent\n\ncontent\n\n\n\ncontent');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content\ncontent\ncontent\n\ncontent\n\ncontent');
    });

    $httpBackend.flush();
  });

  it('should cleanup content from double spaces', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content   content  content content');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content content content content');
    });

    $httpBackend.flush();
  });

  it('should cleanup from trailing spaces', function () {
    $httpBackend.expectGET(verse.path + '/content.txt').respond('content \ncontent \ncontent\ncontent content');

    verse.loadContent().then(function(){
      expect(verse.content).toBe('content\ncontent\ncontent\ncontent content');
    });

    $httpBackend.flush();
  });

  it('should properly normalize string to easy difficulty', function () {
    expect(verse.normalizeStringToDifficulty('The quick brown fox {jumps over the {lazy dog}}', Verse.prototype.DIFFICULTY_EASY)).toBe('The quick brown fox jumps over the {lazy dog}');

    $httpBackend.flush();
  });

  it('should properly normalize string to normal difficulty', function () {
    expect(verse.normalizeStringToDifficulty('The quick brown fox {jumps over the {lazy dog}}', Verse.prototype.DIFFICULTY_NORMAL)).toBe('The quick brown fox {jumps over the lazy dog}');

    $httpBackend.flush();
  });

  it('should return proper pieces', function () {
    var mockVerseContent = 'Word {word {word}}\nWord {word}\nWord {word word{}}';
    $httpBackend.expectGET(verse.path + '/content.txt').respond(mockVerseContent);

    verse.loadContent().then(function(){
      var pieces = null;

      pieces = verse.getPieces({
        difficulty: Verse.prototype.DIFFICULTY_EASY
      });
      expect(pieces.length).toBe(33, 'for easy difficulty');

      pieces = verse.getPieces({
        difficulty: Verse.prototype.DIFFICULTY_NORMAL
      });
      expect(pieces.length).toBe(20, 'for normal difficulty');
    });

    $httpBackend.flush();
  });

  it('should return proper author', function () {
    var mockedStructure = {
      "authors": [
        {
          "name": "test_author",
          "fullName": "Test Author",
          "shortName": "Test A."
        }
      ]
    };
    $httpBackend.expectGET('resources/verses/structure.json').respond(JSON.stringify(mockedStructure)); // for VerseDataStore

    verse.getAuthor().then(function(author){
      expect(author).toBeDefined('author should be defined');
      expect(author.fullName).toBe(mockedStructure.authors[0].fullName);
    });

    $httpBackend.flush();
  });

  it('should match verses properly', function () {
    var verseToMatch = new Verse({
      'name': 'test_name',
      'authorName': 'test_author'
    });
    var verseToNotMatch = new Verse({
      'name': 'test_name',
      'authorName': 'test_author2'
    });
    var verseToNotMatch2 = new Verse({
      'name': 'test_nam',
      'authorName': 'test_author'
    });

    expect(verse.isMatch(verseToMatch)).toBe(true, 'should match');
    expect(verse.isMatch(verseToNotMatch)).toBe(false, 'should not match');
    expect(verse.isMatch(verseToNotMatch2)).toBe(false, 'should not match');

    $httpBackend.flush();
  });

});
