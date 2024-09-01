from typing import Tuple, Any
from ultralytics import YOLO
import sys
import os
import numpy as np
import pyswarms as ps

# Pretrained Model
YOLO_MODEL = "yolov8n-cls.pt"


def yolo_train_and_evaluate(params: Tuple[float, float, int, float]) -> float:
    """Train and evaluate YOLO model with given hyperparameters."""
    learning_rate, batch_size, epochs, weight_decay = params
    model = YOLO(model=YOLO_MODEL)
    dataset_abs_path = os.path.abspath("./datasets")
    results = model.train(data=dataset_abs_path, epochs=int(epochs), lr0=learning_rate, batch=int(batch_size), weight_decay=weight_decay)
    return float(results.metrics['loss'])  # Convert loss to a Python float



def yolo_objective_function(params: Any) -> float:
    """Objective function for optimization."""
    n_particles = params.shape[0]
    losses = [yolo_train_and_evaluate(params[i]) for i in range(n_particles)]
    return np.array(losses)


def training_with_pso(pretrained_model: str, datasets: str, iters: int = 10) -> Any:
    """Train new model using PSO for hyperparameter optimization."""
    options = {'c1': 0.5, 'c2': 0.3, 'w': 0.9}
    bounds = ([1e-5, 16, 5, 1e-5], [1e-1, 128, 50, 1e-2])  # Adjusted bounds for learning_rate, batch_size, epochs, weight_decay
    optimizer = ps.single.GlobalBestPSO(n_particles=10, dimensions=4, options=options, bounds=bounds)
    cost, pos = optimizer.optimize(yolo_objective_function, iters=iters)
    print(f"Best Cost (PSO): {cost}, Best Position (PSO): {pos}")
    return cost, pos


def fox(SearchAgents_no, Max_iter, lb, ub, dim, fobj):
    """FOX Optimizer implementation."""
    Best_pos = np.zeros(dim)
    Best_score = float('inf')
    MinT = float('inf')
    X = np.random.uniform(low=lb, high=ub, size=(SearchAgents_no, dim))
    Distance_Fox_Rat = np.zeros((SearchAgents_no, dim))

    l = 0  # Loop counter
    c1 = 0.18  # range of c1 is [0, 0.18]
    c2 = 0.82  # range of c2 is [0.19, 1]

    while l < Max_iter:
        for i in range(X.shape[0]):
            # Return back the search agents that go beyond the boundaries of the search space
            X[i] = np.clip(X[i], lb, ub)

            # Calculate objective function for each search agent
            fitness = fobj(X[i])

            # Update Alpha
            if fitness < Best_score:
                Best_score = fitness  # Update alpha
                Best_pos = X[i].copy()

        a = 2 * (1 - (l / Max_iter))
        Jump = 0

        for i in range(X.shape[0]):
            r = np.random.rand()
            p = np.random.rand()
            if r >= 0.5:
                if p > 0.18:
                    Time = np.random.rand(dim)
                    sps = Best_pos / Time
                    Distance_S_Travel = sps * Time
                    Distance_Fox_Rat[i] = 0.5 * Distance_S_Travel
                    tt = np.sum(Time) / dim
                    t = tt / 2
                    Jump = 0.5 * 9.81 * t ** 2
                    X[i] = Distance_Fox_Rat[i] * Jump * c1
                else:
                    Time = np.random.rand(dim)
                    sps = Best_pos / Time
                    Distance_S_Travel = sps * Time
                    Distance_Fox_Rat[i] = 0.5 * Distance_S_Travel
                    tt = np.sum(Time) / dim
                    t = tt / 2
                    Jump = 0.5 * 9.81 * t ** 2
                    X[i] = Distance_Fox_Rat[i] * Jump * c2
                if MinT > tt:
                    MinT = tt
            else:
                # random walk
                X[i] = Best_pos + np.random.randn(dim) * (MinT * a)

        l += 1

    return Best_score, Best_pos


def training_with_fox(pretrained_model: str, datasets: str, iters: int = 10) -> Any:
    """Train new model using FOX for hyperparameter optimization."""
    SearchAgents_no = 10
    Max_iter = iters
    lb = np.array([1e-5, 16, 5, 1e-5])
    ub = np.array([1e-1, 128, 50, 1e-2])
    dim = 4

    cost, pos = fox(SearchAgents_no, Max_iter, lb, ub, dim, yolo_objective_function)
    print(f"Best Cost (FOX): {cost}, Best Position (FOX): {pos}")
    return cost, pos


def training(pretrained_model: str, datasets: str, epochs: int = 10) -> Any:
    """Train new model."""
    model = YOLO(model=pretrained_model)
    dataset_abs_path = os.path.abspath(datasets)
    results = model.train(data=dataset_abs_path, epochs=epochs)
    return results


def predict(model_path: str, target_asset: str) -> YOLO:
    """Predict/Test the custom trained model."""
    model = YOLO(model_path)
    results = model(target_asset)
    return results


def validation(model_path: str) -> Tuple[Any, Any]:
    """Validate the custom trained model."""
    model = YOLO(model_path)
    metrics = model.val()
    return metrics.top1, metrics.top5


if __name__ == "__main__":
    if "train" in sys.argv:
        if "pso" in sys.argv:
            training_with_pso(YOLO_MODEL, "./datasets", iters=2)
        elif "fox" in sys.argv:
            training_with_fox(YOLO_MODEL, "./datasets", iters=2)
        else:
            training(YOLO_MODEL, "./datasets", epochs=15)
    elif "predict" in sys.argv:
        predict("/runs/classify/train2/weights/last.pt", "/path/to/test/image[.jpg]")
    elif "validate" in sys.argv:
        validation("/runs/classify/train2/weights/best.pt")
    else:
        print(
            "Command Line Arguments:\n\n'train'\t\tFor training new model\n'predict'\tFor predicting new data\n'validate'\tFor validating your custom trained model"
        )

      