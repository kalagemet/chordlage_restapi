# chordlage_restapi

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h3 align="center">Chord API's</h3>
</div>


## Getting Started

You need to put acces token on header off requests
```
access-token: $SECRET_ACCESTOKEN
```

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- Body of request
  ```sh
    {
        route: FUNCTION_NAME,
        payload: {
            THIS IS PAYLOAD REQURED REQUEST
        },
        token: DYNAMIC_TOKEN_REQUEST,
        id_app: APP_ID
    }
  ```
 - Example
    ```
    {
        "route": "postChord", 
        "payload": {
            "judul": "Tenang ", 
            "nama_band": "Yura Yunita", 
            "chord": "kksks", 
            "abjad": 26, 
            "created_by": 0, 
            "flag": "TOP INDO"
        }, 
        "token": "T0oekejfnJajalsnSajanf", 
        "id_app": "itufggbuA7Chobacoba"
    }
    ```
<!-- ROADMAP -->

## Roadmap

- [x] Change to singgle route
- [x] Improve middleware
- [] Add dynamic route scurity
