# Green-Guardian: Backend

## Endpoints

#### `/` `[POST]`

**Request**

```json
{}
```

**Response**

```json
{
    "status": true,
    "message": "Connected to the server."
}
```
_StatusCode = 200_

#### `/disease/predict` `[POST]`

| Parameter(s) | MimeType              |
| ------------ | --------------------- |
| `Form`       | `multipart/form-data` |
| `image`      | `image/*`             |

**Request**

```json
{
    "image": "FileData,image/*"
}
```

**Response**

-   On Failure

    ```json
    {
        "status": false,
        "message": "string"
    }
    ```

-   On Success

    ```json
    {
        "status": true,
        "data": {
            "disease": "string", // Disease name,
            "treatments": ["string"] // List of treatments
        }
    }
    ```

-   Expected StatusCode and their meanings.

    | StatusCode | Meaning                |
    | ---------- | ---------------------- |
    | 400        | Bad Request            |
    | 200        | Success                |
    | 415        | Unsupported Media Type |

    _Appropriate reason for the StatusCode will be sent as response under key `message`_
