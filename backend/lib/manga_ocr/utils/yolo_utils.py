import numpy as np

def xywh2xyxy(x):
    # Convert nx4 boxes from [x, y, w, h] to [x1, y1, x2, y2]
    y = np.copy(x)
    y[:, 0] = x[:, 0] - x[:, 2] / 2  # top left x
    y[:, 1] = x[:, 1] - x[:, 3] / 2  # top left y
    y[:, 2] = x[:, 0] + x[:, 2] / 2  # bottom right x
    y[:, 3] = x[:, 1] + x[:, 3] / 2  # bottom right y
    return y

def box_iou(box1, box2):
    # https://github.com/pytorch/vision/blob/master/torchvision/ops/boxes.py
    """
    Return intersection-over-union (IoU) of boxes.
    Both sets of boxes are expected to be in (x1, y1, x2, y2) format.
    Arguments:
        box1 (np.ndarray): [N, 4]
        box2 (np.ndarray): [M, 4]
    Returns:
        iou (np.ndarray): [N, M]
    """

    def box_area(box):
        # box = 4xn
        return (box[2] - box[0]) * (box[3] - box[1])

    area1 = box_area(box1.T)
    area2 = box_area(box2.T)

    # inter(N,M) = (rb(N,M,2) - lt(N,M,2)).clamp(0).prod(2)
    lt = np.maximum(box1[:, None, :2], box2[:, :2])  # [N,M,2]
    rb = np.minimum(box1[:, None, 2:], box2[:, 2:])  # [N,M,2]

    inter = np.prod(np.clip(rb - lt, a_min=0, a_max=None), axis=2)
    return inter / (area1[:, None] + area2 - inter)  # iou = inter / (area1 + area2 - inter)

def non_max_suppression(prediction, conf_thres=0.4, iou_thres=0.35):
    """Performs Non-Maximum Suppression (NMS) on inference results
    Returns:
        detections: [N, 6] (x1, y1, x2, y2, conf, cls)
    """
    
    # Filter by confidence
    xc = prediction[..., 4] > conf_thres
    
    # Settings
    max_wh = 4096  # (pixels) maximum box width and height
    max_det = 300  # maximum number of detections per image
    
    # NOTE: Output of YOLO in ONNX can be [1, 25200, 6] or similar
    # We assume batch size 1
    x = prediction[0]
    x = x[xc[0]]
    
    if not x.shape[0]:
        return [np.zeros((0, 6))]
    
    # Compute conf
    x[:, 5:] *= x[:, 4:5]  # conf = obj_conf * cls_conf
    
    # Box (center x, center y, width, height) to (x1, y1, x2, y2)
    box = xywh2xyxy(x[:, :4])
    
    # Detections matrix [n, 6] (x1, y1, x2, y2, conf, cls)
    conf = np.max(x[:, 5:], axis=1, keepdims=True)
    j = np.argmax(x[:, 5:], axis=1, keepdims=True)
    x = np.concatenate((box, conf, j.astype(np.float32)), axis=1)[conf.flatten() > conf_thres]
    
    if not x.shape[0]:
        return [np.zeros((0, 6))]
    
    # Sort by confidence
    x = x[x[:, 4].argsort()[::-1]]
    
    # Batched NMS (naive implementation)
    c = x[:, 5:6] * max_wh  # classes
    boxes, scores = x[:, :4] + c, x[:, 4]  # boxes (offset by class), scores
    
    n = boxes.shape[0]
    keep = []
    indices = np.arange(n)
    
    while indices.size > 0:
        i = indices[0]
        keep.append(i)
        if indices.size == 1:
            break
        
        ious = box_iou(boxes[i:i+1], boxes[indices[1:]])[0]
        indices = indices[1:][ious < iou_thres]
        
    return [x[keep][:max_det]]
