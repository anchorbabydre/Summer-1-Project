var DATA = [
  {
    "name": "Candidate species",
    "description": "A plant or animal considered for possible addition to the List of Endangered and Threatened Species. These are taxa for which the Fish and Wildlife Service has on file sufficient information on biological vulnerability and threat(s) to support issuance of a proposal to list, but issuance of a proposed rule is currently precluded by higher priority listing actions.",
    "related": ["CCA", "CCAA", "Endangered Species Act"],
    "synonyms": []
  },
  {
    "acronym": "CCAA",
    "name": "Candidate conservation agreement with assurances",
    "description": "Voluntary agreements between the U.S. Fish and Wildlife Service and non-Federal property owners. The property owner agrees to manage their lands or waters in ways that remove threats to candidate or proposed species assurances that their conservation efforts will not result in future regulatory obligations in excess of those they agree to at the time they enter into the agreement.",
    "related": ["CCA"],
    "synonyms": []
  },
  {
    "name": "Best available science",
    "description": "To assure the quality of the biological, ecological, and other information used in the implementation of the Act, it is the policy of the Services to: (1) evaluate all scientific and other information used to ensure that it is reliable, credible, and represents the best scientific and commercial data available; (2) gather and impartially evaluate biological, ecological, and other information disputing official positions, decisions, and actions proposed or taken by the Services; (3) document their evaluation of comprehensive, technical information regarding the status and habitat requirements for a species throughout its range, whether it supports or does not support a position being proposed as an official agency position; (4) use primary and original sources of information as the basis for recommendations; (5) retain these sources referenced in the official document as part of the administrative record supporting an action; (6) collect, evaluate, and complete all reviews of biological, ecological, and other relevant information within the schedules established by the Act, appropriate regulations, and applicable policies; and (7) require management-level review of documents developed and drafted by Service biologists to verify and assure the quality of the science used to establish official positions, decisions, and actions taken by the Services during their implementation of the Act.",
    "related": [],
    "synonyms": []
  }];

$(function() {
  var loadedData = false,
      $goGlossary = $('.go-glossary'),
  		$wrapper = $('.wrapper'),
      source = $('#glossary-template').html(),
      template = Handlebars.compile(source),
      $termsList = $('.glossary-terms'),
      $search = $('input[type=search]'),
      terms;

  // After each key stroke compare the search box query against the name and description of each term
  $search.on('keyup input propertychange paste', function() {
    var filtered = filterTerms(terms);
    // Recompile the template with the filtered,alphebetized terms list
    compileTemplate(filtered);
  });

  function loadData(filter) {
    $termsList.empty().append('<li>Loading terms...</li>');
  	// jQuery.getJSON('js/data.js', function(data) {
      terms = DATA;
      if (filter) DATA = filterTerms(terms);
      compileTemplate(DATA);
      loadedData = true;
    // });
  }

  function filterTerms(data) {
    var query = $search.val().toLowerCase();
    return $.grep(data, function(obj) {
      return (obj.name.toLowerCase().indexOf(query) >= 0 ||obj.related.toString().toLowerCase().indexOf(query) >= 0|| obj.description.toLowerCase().indexOf(query) >= 0);
    });
  }

  function compileTemplate(data) {
    data.sort(compare);
    $termsList.empty().append( template({ 'terms': data }) );
    registerTagHandler();
  }

  // change search term when user clicks a tag
  function registerTagHandler() {
    var $tag = $('.tag');
    $tag.on('click', function() {
      $search.val($(this).text());

      var filtered = filterTerms(terms);
      compileTemplate(filtered);
    });
  }

  //filter function for ordering glossary terms
  function compare(a,b) {
    if (a.name < b.name)
       return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  $( document ).ready(function() {
    if (!loadedData) loadData();
    $wrapper.addClass('show-glossary');
  });

  // $('.toggle-glossary').click(function() {
  //   if (!loadedData) loadData();
  //   $wrapper.addClass('show-glossary');
  // });
  // $('.toggle-home').click(function() {
  //   $('.wrapper').removeClass('show-glossary');
  // });

  $goGlossary.on('click', function() {
    $search.val($(this).text());
    if (!loadedData) {
      loadData($(this).text());
    } else {
      var filtered = filterTerms(terms);
      compileTemplate(filtered);
    }
    $wrapper.toggleClass('show-glossary');
  });

  // Shake the button to grab attention for the demo
  setTimeout(function () {
    var $glossary = $('.toggle-glossary');

    $glossary.addClass('shake');
    $glossary.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
      $glossary.removeClass('shake');
    });
  }, 3000);
});
