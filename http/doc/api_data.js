define({ "api": [
  {
    "type": "post",
    "url": "/client",
    "title": "Create a new client",
    "version": "0.1.0",
    "name": "CreateClient",
    "group": "Client",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Create a new client.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the application the client is created for.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create client:",
          "content": "{\n  \"name\": \"SpaceCP\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "Message",
            "description": "<p>A message of success.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "data",
            "description": "<p>The client object created.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Client added!\",\n  \"data\": {\n    \"__v\": 0,\n    \"userId\": \"55bcfd439fc60f902808da36\",\n    \"secret\": \"$2a$05$jjU7Tx7ssFGMs0Zp7TjVGOfG9kilWgUb8atQ7yikp2Mjl7w/nUX3O\",\n    \"id\": \"$2a$05$aP6QNevEHPfQYDL1tNeYqOKHyTfkfOXXfwKvbKYzWa8mGXST3wXrO\",\n    \"name\": \"MailTest\",\n    \"_id\": \"55bcffbc6aeb0af00ad0cfe8\"\n  }\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Username/Password is not valid.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"name/id/secret not filled in.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/client.js",
    "groupTitle": "Client"
  },
  {
    "type": "delete",
    "url": "/client",
    "title": "Delete a client",
    "version": "0.1.0",
    "name": "DeleteClient",
    "group": "Client",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Delete a client.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the client to be deleted. (found by a GET request, it's the _id property).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Successfull request:",
          "content": "{\n  \"id\": \"55bcfe016aeb0af00ad0cfe4\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>A message of success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Client deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>ID was not given.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>given id was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"No id given.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"The given id was not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/client.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/client",
    "title": "Get all clients",
    "version": "0.1.0",
    "name": "GetClients",
    "group": "Client",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Gives back a list of clients registered with there properties.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>All client objects registered.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"55bcfd686aeb0af00ad0cfe3\",\n    \"userId\": \"55bcfd439fc60f902808da36\",\n    \"name\": \"mail\",\n    \"__v\": 0\n  },\n  {\n    \"_id\": \"55bcfe016aeb0af00ad0cfe4\",\n    \"userId\": \"55bcfd439fc60f902808da36\",\n    \"name\": \"SpaceCP\",\n    \"__v\": 0\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/client.js",
    "groupTitle": "Client",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "version": "0.1.0",
    "name": "LoginUser",
    "group": "Login",
    "description": "<p>Login on a user account, it returns a token which is valid for 24 hours.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password which belongs to the username.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Login to a user:",
          "content": "{\n  \"username\": \"AtlasDev\",\n  \"password\": \"supersecretpassword\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>The id of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>User object of the user logged in.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"0TXlLAtzDPSIwiWQ93VnFMB5UHkbCUTTv43JICXXSEmxtqhJTiPVPosZidvpxshh\",\n  \"user\": {\n    \"_id\": \"55e06be7650cf63410cdf8ad\",\n    \"username\": \"admin\",\n    \"group\": \"55e06be7650cf63410cdf8aa\",\n    \"__v\": 0,\n    \"mailboxes\": [\n      \"55e06be7650cf63410cdf8af\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The username/password is invalid.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/login.js",
    "groupTitle": "Login"
  },
  {
    "type": "delete",
    "url": "/login",
    "title": "Logout",
    "version": "0.1.0",
    "name": "LogoutUser",
    "group": "Login",
    "description": "<p>Logout the current logged in user.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Simple success message.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Logout successfull.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/login.js",
    "groupTitle": "Login",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Create a new User",
    "version": "0.1.0",
    "name": "CreateUser",
    "group": "User",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Create a new user.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Desired username of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Desired password of the user.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new user:",
          "content": "{\n  \"username\": \"AtlasDev\",\n  \"password\": \"supersecretpassword\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>The id of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "mailboxes",
            "description": "<p>The mailboxes the user has access to.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>The number of the users group (1=user 2=mod 3=admin)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"55bcf8a904edc314212c857d\",\n  \"username\": \"AtlasDev\",\n  \"mailboxes\": [],\n  \"group\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Username/Password not filled in.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Username/Password not filled in.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user",
    "title": "Delete a user",
    "version": "0.1.0",
    "name": "DeleteUser",
    "group": "User",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Delete a user.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user to be deleted (found by a GET request, it's the _id property).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Successfull request:",
          "content": "{\n  \"id\": \"55bcf8a904edc314212c857d\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>A message of success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"User deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>ID was not given.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>given id was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMITTED",
            "description": "<p>You cannot delete yourself.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"No id given.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"The given id was not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot delete yourself.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot delete the first user.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get all users",
    "version": "0.1.0",
    "name": "GetUsers",
    "group": "User",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Gives back a list of users registered with there properties.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>All user objects registered.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Get all users:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"55bcf88eaa9f7e8c217ee376\",\n    \"username\": \"admin\",\n    \"mailboxes\": [],\n    \"group\": 3\n  },\n  {\n    \"_id\": \"55bcf8a904edc314212c857d\",\n    \"username\": \"AtlasDev\",\n    \"mailboxes\": [],\n    \"group\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/user/group",
    "title": "Update the group of a user",
    "version": "0.1.0",
    "name": "UpdateUserGroup",
    "group": "User",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Update the group of a user.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>The id of the new group (1=User 2=Mod 3=Admin)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Successfull request:",
          "content": "{\n  \"id\": \"55bcf8a904edc314212c857d\",\n  \"group\": \"2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>A message of success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"User group updated.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>ID or group was not given.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>given id was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMITTED",
            "description": "<p>You cannot change your own group.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"No id/group given.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Group not valid\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"The given id was not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot change your own group.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot the group of the first user.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/user.js",
    "groupTitle": "User"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p> "
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "_home_dany_Projects_MailJS_http_doc_main_js",
    "groupTitle": "_home_dany_Projects_MailJS_http_doc_main_js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/oauth/authorize",
    "title": "Request for authorization",
    "version": "0.1.0",
    "name": "getAuthorize",
    "group": "oauth",
    "description": "<p>Request authorization from a client to the account of a user</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "client_id",
            "description": "<p>The id of the client requesting access.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "response_type",
            "description": "<p>Response type, should always be code.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "redirect_uri",
            "description": "<p>Redirect uri where the code will be send to after the user has accepted the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "authorize an client with the id `55bcf8a904edc314212c857d`:",
          "content": "/api/oauth2/authorize?client_id=55bcf8a904edc314212c857d&response_type=code&redirect_uri=http://localhost",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>html</p> ",
            "optional": false,
            "field": "html",
            "description": "<p>The dialoge page with the request for permissions</p> "
          }
        ]
      }
    },
    "filename": "./docfiles/old/oauth.js",
    "groupTitle": "oauth"
  },
  {
    "type": "POST",
    "url": "/oauth/token",
    "title": "Exchange code",
    "version": "0.1.0",
    "name": "postToken",
    "group": "oauth",
    "description": "<p>Exchange a code for a bearer access token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Sting</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>The code gain from the callback (see /oauth/authorize).</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "response_type",
            "description": "<p>Response type, should always be code.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "redirect_uri",
            "description": "<p>The redirect url which was used in GET /oauth/authorize, used as validation</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Exchange a code for a token:",
          "content": "{\n  \"code\": \"Aq4XW8Fleb\",\n  \"response_type\": \"code\",\n  \"redirect_uri\": \"http://localhost\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "mailboxes",
            "description": "<p>The mailboxes the user has access to.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>The number of the users group (1=user 2=mod 3=admin)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"55bcf8a904edc314212c857d\",\n  \"username\": \"AtlasDev\",\n  \"mailboxes\": [],\n  \"group\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/oauth.js",
    "groupTitle": "oauth"
  }
] });