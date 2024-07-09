# Machine Learning - Predict Image

---

## Endpoint(s)

| Endpoint   | Allowed Methods | Response                                  |
| ---------- | --------------- | ----------------------------------------- |
| `/predict` | `POST`          | [Response](#predict-response-and-request) |

## Response

#### `/Predict` Response and Request

**Request**

```json
{
    "image_src": "YOUR/IMAGE/URL"
}
```

**Resonse**

```json
{
    "data": ["List", "of", "classes"] // Or null
}
```
