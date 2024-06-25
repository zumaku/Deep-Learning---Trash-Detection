import torch

# Load your YOLO model
model = torch.load('yolov8.pt')

# Dummy input for the model
dummy_input = torch.randn(1, 3, 640, 640)

# Export the model to ONNX format
torch.onnx.export(model, dummy_input, "yolov8.onnx", opset_version=11)

