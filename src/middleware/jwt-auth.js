const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let bearerToken
    if(!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token'})
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    try{
        console.error('in try block')
        const payload = AuthService.verifyJwt(bearerToken)
        console.error('passed jwt')
        AuthService.getUserWithUserName(
            req.app.get('db'),
            payload.sub,
        )
        .then(user => {
            console.error('in then')
            if(!user)
                return res.status(401).json({ error: 'Unauthorized request1'})

            req.user = user
            next()
        })
        .catch(err => {
            console.error(err)
            next(err)
        })
        
    } catch(error){
        res.status(401).json({ error: 'Unauthorized request2'})
    }
    
  }
  
  module.exports = {
    requireAuth,
  }