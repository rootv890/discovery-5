
/**
 * Stored all the react router routes
 * NOT IMPLEMENTED YET
 */


interface Routes {
  path: string;
  name: string;
  children?: Routes[];
}


export const routes: Routes[] = [
  {
    path: "/",
    name: "Home",
  },

  {
    path: "/about",
    name: "About",
  },
  {
    path: "/contact",
    name: "Contact",
  },


  // Authentications
  {
    path: '/auth',
    name: 'Auth',
    children: [
      {
        path: '/login',
        name: 'Login'
      },
      {
        path: '/register',
        name: 'Register',
        // 2FA, oAuth missign fields,

        children: [
          {
            path: '/verify-code',
            name: "Verify Code"
          },
          {
            path: '/missing-field',
            name: "Missing field"
          }
        ]

      }
    ]
  }

];
