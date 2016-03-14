/*eslint-disable */

module.exports = [
  {
    pattern: 'https://auth.realmassive.com(.*)',
 
    fixtures: function(match, params, headers) {
      var tokens = {
        access_token: 'your_access_token', 
        token_type: 'Bearer', 
        expires_in: 3600, 
        refresh_token: 'your_refresh_token'
      };

      function checkBearer(headers) {
        if (headers.authorization &&
            headers.authorization == 'Bearer ' + tokens.access_token)
          return true;
        else
          return false;
      }

      var route = match[1];
      switch (route) {
        case '/login':
          if (headers.Authorization &&
              headers.Authorization.match(/^Basic/))
            return tokens;
          else
            throw new Error(401);
        case '/refresh':
          if (params.refresh_token == tokens.refresh_token) {
            tokens.access_tokens = 'your_new_access_token';
            return tokens;
          } else
            throw new Error(401);
        case '/logout':
          if (checkBearer(headers))
            return;
          else
            throw new Error(401);
        case '/test':
          if (checkBearer(headers))
            return { message: 'success!' };
          else
            throw new Error(401);
      }
    },
 
    get: function(match, data) {
      return Error(404);
    },
 
    post: function(match, data) {
      var response = {
        status: 200,
        body: data
      };
      if (match[1] == '/logout')
        response.status = 204;
      return response;
    }
  }
];
