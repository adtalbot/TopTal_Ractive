(function () {
  var skills = DB.skills, developers = DB.developers;                           //Getting the skills array from the database
  var skillNames = _.keys(DB.skills);                                           //Stores skill list in the variable skillNames outside of Ractive scope

  var app = new Ractive({                                                       //Instantiates a new Ractive app
    el: '#root'                                                                 //Tells it to render inside of the HTML element with id='root'
    template: '#tpl-app',                                                       //Tells it to use a script element with id='tpl-app'
    data: {                                                                     //Passes the intial data in the form of an array

      skillFilter: null,
      currentSkill: null,
      skills: function() {                                                      //Skills function
        var skillFilter = this.get('skillFilter');                              //Gets the skillFilter variable from the Ractive instance(available as 'this')
        if (!skillFilter) {
          return skillNames;
        }
        skillFilter = new RegExp(_.escapeRegExp(skillFilter), 'i')
        return _.filter(skillNames, function(skill) {
          return skill.match(skillFilter)
        });
      },

      skillDevelopers: function(skill) {
        skill = skills[skill];                                                  //Gets the skill object from the DB
        if (!skill) {                                                           //Checks for the skill name, returns early if unknown skill name
          return;
        }
        return _.map(skill.developers, function(slug) {                         //Maps the developers IDs (slugs) to the actual developer detail objects
          return developers[slug];
        });
      }
    }
  });

  app.on('select-skill', function(event, skill) {                               //Subscribes to the logical event select-skill
    this.set({
      currentSkill: skill,                                                      //Sets currentSkill to the skill selected by the user
      skillFilter: null                                                         //Resets the search filter
    });
  });
  app.on('deselect-skill', function(event) {                                    //Subscribe to logical event deselect-skill
    this.set('currentSkill', null);                                             //Clears currentSkill
  });
}());
