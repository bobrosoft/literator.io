/**
 * Literator.io
 * Copyright 2016 Vladimir Tolstikov <bobr@bobrosoft.com>
 *
 * Utility to collect information about existing (in filesystem) authors, verses and update structure.json static file.
 *
 * THIS SOFTWARE IS PROVIDED BY Vladimir Tolstikov "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL Vladimir Tolstikov BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function(nodeFs, nodePath, nodeUtil, skipFiles) {

  var initialDir = nodePath.dirname(__filename);
  var validMoodValues = ['happy', 'active', 'calm', 'sad'];
  var finalStructure = {
    'authors': [],
    'verses': []
  };

  // Go through authors' directories
  nodeFs.readdirSync(initialDir).forEach(function(authorDir) {
    var authorFullPath = initialDir + nodePath.sep + authorDir;

    // Exit, if in skip list
    if (isInSkipFiles(authorDir)) {
      return;
    }

    // Exit, if not a directory
    if (!nodeFs.statSync(authorFullPath).isDirectory()) {
      return
    }

    console.log('\n[' + authorDir + ']');

    // Read author's meta
    try {
      var authorMeta = JSON.parse(nodeFs.readFileSync(authorFullPath + nodePath.sep + 'meta.json', 'utf-8'));
    } catch (e) {
      reportValidationError('no "meta.json" file found or wrong file format (should contain valid JSON)');
    }

    // Check if all required attributes set
    var missingAttributes = getMissingAttributes(authorMeta, ['name', 'fullName', 'shortName', 'birthYear', 'deathYear', 'wikiLink', 'originCountry', 'studiedInCountries'])
    if (missingAttributes.length) {
      reportValidationError('author\'s "meta.json" is not full, next attributes are missing: ' + missingAttributes.join(', '));
    }

    // Check studiedInCountries value
    if (!authorMeta.studiedInCountries || !nodeUtil.isArray(authorMeta.studiedInCountries) || !authorMeta.studiedInCountries.length) {
      reportValidationError('author\'s "meta.json" is not full, "studiedInCountries" is not an array or contain no countries');
    }

    // Add info about author to structure
    finalStructure.authors.push(authorMeta);

    // Go through all verses
    nodeFs.readdirSync(authorFullPath + nodePath.sep + 'verses').forEach(function(verseDir) {
      var verseFullPath = authorFullPath + nodePath.sep + 'verses' + nodePath.sep + verseDir;

      // Exit, if in skip list
      if (isInSkipFiles(verseDir)) {
        return;
      }

      console.log(' - ' + verseDir);

      // Read verse's meta
      try {
        var verseMeta = JSON.parse(nodeFs.readFileSync(verseFullPath + nodePath.sep + 'meta.json', 'utf-8'));
      } catch (e) {
        reportValidationError('no "meta.json" file found or wrong file format (should contain valid JSON)');
      }

      // Check if all required attributes set
      var missingAttributes = getMissingAttributes(verseMeta, ['name', 'title', 'year', 'mood']);
      if (missingAttributes.length) {
        reportValidationError('verse\'s "meta.json" is not full, next attributes are missing: ' + missingAttributes.join(', '));
      }

      // Check mood value
      if (!verseMeta.mood || validMoodValues.indexOf(verseMeta.mood) === -1) {
        reportValidationError('verse\'s "meta.json" is not right, "mood" should be one of: ' + validMoodValues.join(', ') + '. Current value: ' + verseMeta.mood);
      }

      // Add authorName
      verseMeta.authorName = authorMeta.name;

      // Add info about author to structure
      finalStructure.verses.push(verseMeta);
    });
  });

  // Write new structure.json
  try {
    console.log('\nUpdating structure.json ...');
    nodeFs.writeFileSync(initialDir + nodePath.sep + 'structure.json', JSON.stringify(finalStructure, null, '  '), 'utf-8');
  } catch (e) {
    reportValidationError('can\'t overwrite structure.json. Please check file permissions.');
  }

  console.log('DONE!');


  /**
   * Returns TRUE, if passed file match one of skipFiles patterns
   * @param {String} filenameToCheck
   * @returns {boolean}
   */
  function isInSkipFiles(filenameToCheck) {
    for (var i = 0; i < skipFiles.length; i++) {
      if ((new RegExp(skipFiles[i])).test(filenameToCheck)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Reports about validation error and exits tool
   * @param {String} text
   */
  function reportValidationError(text) {
    console.error('ERROR: ' + text);
    process.exit();
  }

  /**
   * Checks and returns missing attributes in passed object
   * @param {Object} object
   * @param {Array} requiredAttributes
   * @returns {Array}
   */
  function getMissingAttributes(object, requiredAttributes) {
    var currentAttributes = Object.keys(object);

    return requiredAttributes.filter(function(item) {
      return currentAttributes.indexOf(item) === -1;
    });
  }

})(
  require('fs'),
  require('path'),
  require('util'),
  [
    '\\..*',
    'packager.js'
  ]
);

