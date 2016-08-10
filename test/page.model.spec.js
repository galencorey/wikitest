var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chai_spy = require('chai-spies');
var models = require('../models');
var Page = models.Page;
chai.should();
chai.use(require('chai-things'));

describe('Page model', function () {


     var Pagey;

     before(function (done){

          Page.sync({force: true}).then(function(){

          Page.create({
            title: 'puppies r c$$l',
            content: '**Puppies are great**',
            status: 'open',
            tags: 'dogs, animals'
          }).then(function (page) {
            Pagey = page;
            done();
          }).catch(function(error){
            console.log(error);
            done();
          });
        });
     });

  describe('Virtuals', function () {

    describe('urlTitle', function () {
      it('returns the url_name prepended by "/wiki/"', function(){
        expect(Pagey.urlTitle).to.be.equal('puppies_r_cl');
      });
    });
    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function(){
        expect(Pagey.route).to.be.equal('/wiki/puppies_r_cl');
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function(){
        expect(Pagey.renderedContent).to.be.equal('<p><strong>Puppies are great</strong></p>\n');
      });
    });
  });

  describe('Class methods', function () {
    describe('findByTag', function () {
      it('gets pages with the search tag', function(done){
        Page.findByTag('dogs')
        .then(function(pages){
            expect(pages).to.have.lengthOf(1);
            done();
        })
        .catch(done);
      });
      it('does not get pages without the search tag', function(done){
        Page.findByTag('computers')
        .then(function(pages){
            expect(pages).to.have.lengthOf(0);
            done();
        })
        .catch(done);
      });
    });
  });

  describe('Instance methods', function () {

    var page1, page2;
    before(function(done){
      Page.create({
        title: 'Kittens',
        content: 'I like kittens',
        status: 'open',
        tags: 'cats, animals'
      }).then(function(page){
        page1 = page;
      }).then(function(){
        Page.create({
          title: 'Spoons',
          content: "Spoons are the best utensil except for forks",
          status: 'closed',
          tags: 'utensils'
        }).then(function(page){
          page2 = page;
          done();
        }).catch(done);
      })
    })

    describe('findSimilar', function () {
      it('never gets itself', function(done){
        Pagey.findSimilar()
        .then(function(pages){
          assert.notInclude(pages, Pagey);
          done();
        }).catch(done);
      });

      xit('gets other pages with any common tags', function(done){
        Pagey.findSimilar()
        .then(function(pages){
          //assert.contains(pages, page1);
          pages.should.include.something.that.deep.equals(page1)
          done();
        }).catch(done);
      });

      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function () {

     var Pagey2;

     before(function (){

      Pagey2 = Page.build({
        status: 2
      });
     });

    it('errors without title', function(done){

      Pagey2.validate()
     .then(function(err){
        expect(err).to.exist;
        expect(err.errors).to.exist;
        expect(err.errors[0].path).to.equal('title');
        done();
       })

    });

    it('errors without content', function(done){
      Pagey2.validate()
     .then(function(err){
        expect(err).to.exist;
        expect(err.errors).to.exist;
        expect(err.errors[2].path).to.equal('content');
        done();
       })
    });

    it('errors given an invalid status', function(done){

      Page.create({
        title: 'swans',
        content: 'swans are not ducks',
        status: 2
      })
     .then(function(){
      done();
     }, function(err){
        expect(err).to.exist;
        expect(err.message).to.contain('status');
        done();
       })
    });
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating', function(){
       expect(Pagey.urlTitle).to.be.equal('puppies_r_cl');
    });
  });
});
