'use strict';

var app = angular.module('atadosApp');

app.factory('Search', function (Restangular, ENV, Cleanup) {
  var _query = '';
  var _cause = {};
  var _skill = {};
  var _address = {};

  var _highlightedProjects = [];
  var _highlightedNonprofits = [];

  var _cardListProjects = [];
  var _cardListNonprofits = [];

  var _mapProjects = [];
  var _mapNonprofits = [];

  var _nextUrlProject = '';
  var _nextUrlNonprofit = '';

  var _projectCount = 0;
  var _nonprofitCount = 0;

  var _loading = false;

  var toHttps = function (url) {
    if (url && (ENV === 'production' || ENV === 'homolog')) {
      return url.replace('http','https');
    }
    return url;
  };

  var fixProjects = function (projects) {
    projects.forEach(Cleanup.projectForSearch);
    return projects;
  };

  var fixNonprofits = function (nonprofits) {
    nonprofits.forEach(Cleanup.nonprofitForSearch);
    return nonprofits;
  };

  // city is the the city id
  function searchProjects(query, cause, skill, address) {
    var urlHeaders = {
      page_size: 20,
      query: query,
      cause: cause,
      skill: skill,
      address: address,
    };

    _loading = true;
    Restangular.all('projects').getList(urlHeaders).then( function(response) {
      _cardListProjects = response;
      _cardListProjects = fixProjects(response);
      if (_cardListProjects._resultmeta) {
        _nextUrlProject = toHttps(_cardListProjects._resultmeta.next);
        _projectCount = _cardListProjects._resultmeta.count;
      } else {
        _nextUrlProject = '';
      }
      _loading = false;
    }, function () {
      console.error('Não consegui pegar as vagas do servidor.');
      _loading = false;
    });
  }

  // city is the the city id
  var searchNonprofits = function (query, cause, address) {
    var urlHeaders = {
      page_size: 20,
      query: query,
      cause: cause,
      address: address,
    };

    _loading = true;
    Restangular.all('nonprofits').getList(urlHeaders).then( function (response) {
      _cardListNonprofits = [];
      _cardListNonprofits = fixNonprofits(response);
      if (_cardListNonprofits._resultmeta) {
        _nextUrlNonprofit = toHttps(_cardListNonprofits._resultmeta.next);
        _nonprofitCount = _cardListNonprofits._resultmeta.count;
      } else {
        _nextUrlNonprofit = '';
      }
      _loading = false;
    }, function () {
      console.error('Não consegui pegar ONGs do servidor.');
      _loading = false;
    });
  };

  function hasValidAddress(object) {
    // For project objects
    if (object.address && object.address.address_line && object.address.lat !== 0 && object.address.lng !== 0) {
      return true;
    // For Nonprofit objects
    } else if (object.user && object.user.address.address_line && object.user.address && object.user.address.lat !== 0 && object.user.address.lng !== 0) {
      return true;
    } else {
      return false;
    }
  }

  var getMapProjects = function() {
    Restangular.all('map/projects').getList({page_size: 1000}).then( function (projects) {
      _mapProjects = projects.filter(hasValidAddress);
    }, function () {
      console.error('Não consegui pegar Vagas no Mapa do servidor.');
    });
  };
  var getMapNonprofits = function() {
    Restangular.all('map/nonprofits').getList({page_size: 1000}).then( function (nonprofits) {
      _mapNonprofits = nonprofits.filter(hasValidAddress);
    }, function () {
      console.error('Não consegui pegar ONGs no Mapa do servidor.');
    });
  };

  getMapProjects();
  getMapNonprofits();

  return {
    filter: function (query, cause, skill, address) {
      _cardListProjects = [];
      _cardListNonprofits = [];
      searchProjects(query, cause, skill, address);
      searchNonprofits(query, cause, address);
      this.getHighlightedProjects(address);
      this.getHighlightedNonprofits(address);
    },
    query: _query,
    cause: _cause,
    skill: _skill,
    address: _address,
    loading: function () {
      return _loading;
    },
    showProjects: true,
    projectCount: function () {
      return _projectCount;
    },
    nonprofitCount: function () {
      return _nonprofitCount;
    },
    nextUrlProject: function () {
      return _nextUrlProject;
    },
    nextUrlNonprofit: function () {
      return _nextUrlNonprofit;
    },
    setNextUrlProject: function (url) {
      _nextUrlProject = toHttps(url);
    },
    setNextUrlNonprofit: function (url) {
      _nextUrlNonprofit = toHttps(url);
    },
    mapProjects: function() {
      return _mapProjects;
    },
    mapNonprofits: function() {
      return _mapNonprofits;
    },
    projects: function () {
      return _cardListProjects;
    },
    nonprofits: function () {
      return _cardListNonprofits;
    },
    getHighlightedProjects: function (address) {
      if (!address) {
        address = null;
      }
      return Restangular.all('projects').getList({highlighted: true, address: address, page_size: 16}).then( function(projects) {
        _highlightedProjects = fixProjects(projects);
        return;
      }, function () {
        console.error('Não consegui pegar as vagas em destaque do servidor.');
      });
    },
    getHighlightedNonprofits: function (address) {
      if (!address) {
        address = null;
      }
      return Restangular.all('nonprofits').getList({highlighted: true, address: address, page_size: 16}).then( function(nonprofits) {
        _highlightedNonprofits = fixNonprofits(nonprofits);
        return;
      }, function () {
        console.error('Não consegui pegar as ONGs em destaque do servidor.');
      });
    },
    highlightedProjects: function () {
      return _highlightedProjects;
    },
    highlightedNonprofits: function () {
      return _highlightedNonprofits;
    },
  };
});
