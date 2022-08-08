// testing /api/register

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

chai.should();

describe('Users API', () => {
    describe('/api/register', () => {
        it('it should register a new user', (done) => {
            const user = {
                name: 'John Doe',
                password: '123456'
            };
            chai.request(server)

                .post('/api/register')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('name');
                    response.body.should.have.property('email');
                    response.body.should.have.property('password');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name').eq('John Doe');

                    response.body.should.have.property('password').eq('123456');
                    response.body.should.have.property('id').eq(1);
                    done();

                });

        });

        it('it should NOT register a new user', (done) => {
            chai.request(server)
                .post('/api/register')
                .send({})
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('error');
                    response.body.should.have.property('error').eq('Name is required');
                    done();
                }
                );
        }
        );
    }
    );
}
);

