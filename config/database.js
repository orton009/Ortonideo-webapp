if(process.env.NODE_ENV === 'production' ){
  module.exports = {mongoURI : 'mongodb://orton:orton123@ds159776.mlab.com:59776/ortonideo-prod'}
} else{
  module.exports = {mongoURI : 'mongodb://localhost/ortonideo-dev'}
}