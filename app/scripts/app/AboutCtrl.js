'use strict';

var app = angular.module('atadosApp');

app.controller('AboutCtrl', function ($scope) {
  $scope.site.title = 'Atados - Sobre';

  $scope.team = [
    {
      name: 'André Cervi',
      image: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/c205.44.550.550/s160x160/417055_10152269035845293_1847417011_n.jpg',
      where: 'Atados São Paulo',
      description: 'Blah blah'
    },
    {
      name: 'André Cervi',
      image: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/c205.44.550.550/s160x160/417055_10152269035845293_1847417011_n.jpg',
      where: 'Atados São Paulo',
      description: 'Blah blah'
    },
  ];

  function SimpleSlide( items ) {
    var self = {};

    self.current_slide = 0;
    self.items = items;

    self.items[0].__active = true;

    self.next = function() {
      self.items[self.current_slide].__active = false
      self.current_slide = self.current_slide + 1 >= self.items.length ? 0 : self.current_slide + 1
      self.items[self.current_slide].__active = true
    }

    self.previous = function() {
      self.items[self.current_slide].__active = false
      self.current_slide = Math.max( self.current_slide - 1, 0)
      self.items[self.current_slide].__active = true
    }

    return self
  }

  $scope.slides = {
    first: SimpleSlide( [
        {
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae!',
          description: 'Vaga de passar o dia com as crianças na Casa de Ampara Tia Marly'
        },
        {
          text: '2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae!',
          description: '2 Vaga de passar o dia com as crianças na Casa de Ampara Tia Marly'
        }
      ]
    ),
    second: SimpleSlide( [
        {
          text: '3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae!',
          description: 'Vaga de passar o dia com as crianças na Casa de Ampara Tia Marly'
        },
        {
          text: '4 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, earum, quae harum ducimus debitis dolores nulla sint tempore perspiciatis animi atque voluptates repellendus deserunt accusantium velit iure tenetur cum recusandae!',
          description: '2 Vaga de passar o dia com as crianças na Casa de Ampara Tia Marly'
        }
      ]
    )
  }
});


