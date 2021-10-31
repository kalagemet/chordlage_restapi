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
   
## List of Route Function
  - getChord
    To Get Chord Content
    required payload `{ id, user_id }`
	- getRekomendasi,
	  to get list of requmendasi
    required payload `{ flag //TOP INDO, JAWA HITS dll }`
	- getLaguTerkait,
    required payload `{ id }`
	- getListBand
    required payload `{ page, index }`
	- getListBandCari
    required payload `{ page, string }`
	- getListLagu
    required payload `{ page, band }`
	- getListLaguCari
    required payload `{ page, string }`
	- postChord
    required payload `{ judul, nama_band, chord, abjad, created_by, flag }`
	- deleteChord
    required payload `{ id }`
	- getListCreated
    required payload `{ page, user_id }`
	- getLike
    required payload `{ page, id_user }`
	- updateChord
    required payload `{ id, judul, nama_band, chord, abjad }`
	- likeLagu
    required payload `{ id_chord, id_user }`
	- dislikeLagu
    required payload `{ id_chord, id_user }`
    
    
<!-- ROADMAP -->

## Roadmap

- [x] Change to singgle route
- [x] Improve middleware
- [] Add dynamic route scurity
