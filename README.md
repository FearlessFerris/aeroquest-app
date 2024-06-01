### Aeroquest 

Aeroquest is a free and easy to use application built for avation enthusiasts. 
This application will allow users to create unique user profiles and interact with avation information provided by **[ AviationStackAPI ]( https://aviationstack.com/ )**

### Current Iteration 

In the most up to date iteration **6/1/2024** there are three types of requests to **[ AviationStackApi ]( https://aviationstack.com/ )** that are supported within the Aeroquest Application: 
Below you will find an example of the information that is available to be retrieved and displayed 
    to the user( s ) for access based on the AviationStackAPI endpoint: 
- **Airplanes** 
    ```{
    "pagination": {
        "limit": 100,
        "offset": 0,
        "count": 100,
        "total": 19052
    },
    "data": [
        {
            "registration_number": "YR-BAC",
            "production_line": "Boeing 737 Classic",
            "iata_type": "B737-300",
            "model_name": "737",
            "model_code": "B737-377",
            "icao_code_hex": "4A0823",
            "iata_code_short": "B733",
            "construction_number": "23653",
            "test_registration_number": null,
            "rollout_date": null,
            "first_flight_date": "1986-08-02T22:00:00.000Z",
            "delivery_date": "1986-08-21T22:00:00.000Z",
            "registration_date": "0000-00-00",
            "line_number": "1260",
            "plane_series": "377",
            "airline_iata_code": "0B",
            "airline_icao_code": null,
            "plane_owner": "Airwork Flight Operations Ltd",
            "engines_count": "2",
            "engines_type": "JET",
            "plane_age": "31",
            "plane_status": "active",
            "plane_class": null
        },
        [...
        ]
    ]
    }
    ```
- **Airlines**
    ```
    {
   "pagination": {
       "limit": 100,
       "offset": 0,
       "count": 100,
       "total": 13131
   },
   "data": [
      {
         "airline_name": "American Airlines",
         "iata_code": "AA",
         "iata_prefix_accounting": "1",
         "icao_code": "AAL",
         "callsign": "AMERICAN",
         "type": "scheduled",
         "status": "active",
         "fleet_size": "963",
         "fleet_average_age": "10.9",
         "date_founded": "1934",
         "hub_code": "DFW",
         "country_name": "United States",
         "country_iso2": "US"
      },
      [...]
   ]
    }
    ```
- **Airports** 
    ```
    {
   "pagination": {
       "limit": 100,
       "offset": 0,
       "count": 100,
       "total": 6471
   },
   "data": [
      {
         "airport_name": "Anaa",
         "iata_code": "AAA",
         "icao_code": "NTGA",
         "latitude": "-17.05",
         "longitude": "-145.41667",
         "geoname_id": "6947726",
         "timezone": "Pacific/Tahiti",
         "gmt": "-10",
         "phone_number": null,
         "country_name": "French Polynesia",
         "country_iso2": "PF",
         "city_iata_code": "AAA"
      },
      [...]
   ]
   }
    ```

<!-- ### Getting Started

Create an account!
<video controls width="800" height="500">
  <source src="aeroquest-app/aeroquest-frontend/src/static/video/CreateDemo.mp4" type="video/mp4">
</video> -->
