/**
 * Created by salik on 26.05.17.
 */
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
//let server = require('../src/app.js');
let sleep = require('sleep');
let examples = require('./examples');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Books', () => {
    describe('push_events', () => {
        it('it should GET all the books', (done) => {
            chai.request('http://localhost:8080')
                .post('/api/v1/webhook/test')
                .set('x-gitlab-token', 'change_me')
                .send(examples.push_events)
                .end((err, res) => {
                    done();
                });
        });
    });
    describe('pipeline_events', () => {
        it('it should GET all the books', (done) => {
            chai.request('http://localhost:8080')
                .post('/api/v1/webhook/test')
                .set('x-gitlab-token', 'change_me')
                .send(examples.pipeline_events)
                .end((err, res) => {
                    done();
                });
        });
    });

});

