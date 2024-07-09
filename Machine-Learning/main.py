from flask import Flask, jsonify, request
from packages import predict_image

app = Flask(__name__)

# Configurations
app.config["secret"] = "UNIQUE_SECRET_KEY"
app.config["AUTH_TOKEN"] = "MY_AUTH_TOKEN"
app.config["MODEL"] = "models/best.pt"


@app.errorhandler(404)
def handleNotFound(e):
    return f"<b>{e}</b>"


@app.route("/predict", methods=["POST"])
def predict():
    if request.method != "POST":
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": "Only 'POST' method is allowed",
                }
            ),
            405,
        )
    auth_header = request.headers.get("Authorization")
    if not (auth_header and auth_header.split(" ")[1] == app.config["AUTH_TOKEN"]):
        return (
            jsonify({"status": "failed", "message": "Unauthorized User"}),
            401,
        )

    image_src = request.json.get("image_src", None)
    if not image_src:
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": "Query 'image_src' is missing",
                }
            ),
            422,
        )

    predicted_classes = predict_image(image_src, app.config["MODEL"], True)

    return jsonify({"status": "success", "data": predicted_classes}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", debug=True)
