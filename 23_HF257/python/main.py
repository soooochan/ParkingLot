# -*- coding: utf-8 -*-

import yaml
import numpy as np
import cv2
import os
import torch
from datetime import datetime
import json

# fn = r"../datasets/cut.mpg"
fn = r"../datasets/parkinglot_1_480p.mp4"
# fn_yaml = r"../datasets/CUHKSquare.yml"
fn_yaml = r"../datasets/parking2.yml"
fn_out = r"../datasets/output.avi"
config = {'save_video': False,
          'text_overlay': True,
          'parking_overlay': True,
          'parking_id_overlay': True,
          'parking_detection': True,
          'min_area_motion_contour': 60,
          'park_sec_to_wait': 3,
          'start_frame': 0,
          'yolo': True}  # 35000

# Set capture device or file
cap = cv2.VideoCapture(fn)
# print cap.get(5)
video_info = {'fps':    cap.get(cv2.CAP_PROP_FPS),
              'width':  int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
              'height': int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
              'fourcc': cap.get(cv2.CAP_PROP_FOURCC),
              'num_of_frames': int(cap.get(cv2.CAP_PROP_FRAME_COUNT))}
cap.set(cv2.CAP_PROP_POS_FRAMES, config['start_frame'])  # jump to frame

# Define the codec and create VideoWriter object
if config['save_video']:
    # options: ('P','I','M','1'), ('D','I','V','X'), ('M','J','P','G'), ('X','V','I','D')
    fourcc = cv2.VideoWriter_fourcc('D', 'I', 'V', 'X')
    out = cv2.VideoWriter(fn_out, -1, 25.0,  # video_info['fps'],
                          (video_info['width'], video_info['height']))


# Read YAML data (parking space polygons)
with open(fn_yaml, 'r') as stream:
    parking_data = yaml.full_load(stream)
parking_contours = []
parking_bounding_rects = []
parking_mask = []
for park in parking_data:
    points = np.array(park['points'])
    rect = cv2.boundingRect(points)
    points_shifted = points.copy()
    points_shifted[:, 0] = points[:, 0] - rect[0]  # shift contour to roi
    points_shifted[:, 1] = points[:, 1] - rect[1]
    parking_contours.append(points)
    parking_bounding_rects.append(rect)
    mask = cv2.drawContours(np.zeros((rect[3], rect[2]), dtype=np.uint8), [points_shifted], contourIdx=-1,
                            color=255, thickness=-1, lineType=cv2.LINE_8)
    mask = mask == 255
    parking_mask.append(mask)

parking_status = [False]*len(parking_data)
parking_buffer = [None]*len(parking_data)

# Load Yolo Model
model = torch.hub.load("ultralytics/yolov5", "yolov5s")

# Initialize 1st Analysis Data
data = {
    "camera_id": 1,
    "edge_device_id": 1,
    "parking_area_id": {},
    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "original_video": "https://bucket-name.s3.region-code.amazonaws.com/EdgeID_CamID_timestamp.mov",
    "original_image": "https://bucket-name.s3.region-code.amazonaws.com/EdgeID_CamID_timestamp.jpg"
}

yolo_class_to_label = {
    2: "car",
    3: "motorbike",
    5: "bus",
    7: "truck",
} 

while (cap.isOpened()):
    spot = 0
    occupied = 0
    # Read frame-by-frame
    # Current position of the video file in seconds
    video_cur_pos = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
    # Index of the frame to be decoded/captured next
    video_cur_frame = cap.get(cv2.CAP_PROP_POS_FRAMES)
    ret, frame = cap.read()
    if ret == False:
        print("Capture Error")
        break

    frame_blur = cv2.GaussianBlur(frame.copy(), (5, 5), 3)
    frame_gray = cv2.cvtColor(frame_blur, cv2.COLOR_BGR2GRAY)
    frame_out = frame.copy()

    if config['parking_detection']: 
        # YOLOv5 모델 run
        results = model(frame_out)
        results.save()
        yolo_results = results.xyxy[0]

        for ind, park in enumerate(parking_data):
            points = np.array(park['points'])
            rect = parking_bounding_rects[ind]
            
            # crop roi for faster calculation
            roi_gray = frame_gray[rect[1]:(
                rect[1]+rect[3]), rect[0]:(rect[0]+rect[2])]
            # print np.std(roi_gray)
            points[:, 0] = points[:, 0] - rect[0]  # shift contour to roi
            points[:, 1] = points[:, 1] - rect[1]
            # print np.std(roi_gray), np.mean(roi_gray)
            status = np.std(roi_gray) < 22 and np.mean(roi_gray) > 53
            # If detected a change in parking status, save the current time
            if status != parking_status[ind] and parking_buffer[ind] == None:
                parking_buffer[ind] = video_cur_pos
            # If status is still different than the one saved and counter is open
            elif status != parking_status[ind] and parking_buffer[ind] != None:
                if video_cur_pos - parking_buffer[ind] > config['park_sec_to_wait']:
                    parking_status[ind] = status
                    parking_buffer[ind] = None
            # If status is still same and counter is open
            elif status == parking_status[ind] and parking_buffer[ind] != None:
                # if video_cur_pos - parking_buffer[ind] > config['park_sec_to_wait']:
                parking_buffer[ind] = None

            # 주차 구역 별 1차 분석 데이터
            data["parking_area_id"][park['id']] = {
                "parking_area": "general",
                'vehicle_type': None,
                "start_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "parking_status": 0,
            }

            # 주차 구역의 중심 좌표를 계산
            parking_center_x = rect[0] + rect[2] // 2
            parking_center_y = rect[1] + rect[3] // 2
            
            # YOLO 모델 결과와 주차 구역 결과 매핑
            points = np.array(park['points'])
            for obj_info in yolo_results:
                obj_info = obj_info.tolist()
                obj_xmin, obj_ymin, obj_xmax, obj_ymax, confidence, class_id = obj_info  # 클래스 정보를 추출합니다.
                
                # 객체가 주차 구역 내에 있는지 확인
                isExist = False
                if obj_xmin <= parking_center_x <= obj_xmax and obj_ymin <= parking_center_y <= obj_ymax:
                    if parking_status[ind] != True:
                        parking_status[ind] = True
                    isExist = True

                if isExist and class_id in yolo_class_to_label.keys():
                    data["parking_area_id"][park['id']]['vehicle_type'] = yolo_class_to_label[int(class_id)]
                    data["parking_area_id"][park['id']]['parking_status'] = 1 
                    break
                
        # JSON으로 dump
        json_dir = '1st_analytics/'
        if not os.path.exists(json_dir):
            os.makedirs(json_dir)
        json_path = os.path.join(json_dir, f'frame{int(video_cur_frame)}.json')
        with open(json_path, 'w') as f:
            json.dump(data, f)

    if config['parking_overlay']:
        for ind, park in enumerate(parking_data):
            points = np.array(park['points'])
            if parking_status[ind]:
                color = (0, 255, 0)
                spot = spot+1
            else:
                color = (0, 0, 255)
                occupied = occupied+1
            cv2.drawContours(frame_out, [points], contourIdx=-1,
                             color=color, thickness=2, lineType=cv2.LINE_8)
            moments = cv2.moments(points)
            centroid = (int(moments['m10']/moments['m00'])-3,
                        int(moments['m01']/moments['m00'])+3)
            cv2.putText(frame_out, str(park['id']), (centroid[0]+1, centroid[1]+1),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame_out, str(park['id']), (centroid[0]-1, centroid[1]-1),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame_out, str(park['id']), (centroid[0]+1, centroid[1]-1),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame_out, str(park['id']), (centroid[0]-1, centroid[1]+1),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(frame_out, str(
                park['id']), centroid, cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1, cv2.LINE_AA)
            # print 'occupied: ', occupied
            # print 'spot: ', spot

    # Draw Overlay
    if config['text_overlay']:
        cv2.rectangle(frame_out, (1, 5), (280, 90), (255, 255, 255), 85)
        str_on_frame = "Frames: %d/%d" % (video_cur_frame,
                                          video_info['num_of_frames'])
        cv2.putText(frame_out, str_on_frame, (5, 30), cv2.FONT_HERSHEY_SCRIPT_COMPLEX,
                    0.7, (0, 128, 255), 2, cv2.LINE_AA)
        str_on_frame = "Spot: %d Occupied: %d" % (spot, occupied)
        cv2.putText(frame_out, str_on_frame, (5, 90), cv2.FONT_HERSHEY_SCRIPT_COMPLEX,
                    0.7, (0, 128, 255), 2, cv2.LINE_AA)
    
    # Run YOLOv5
    # if config['yolo']:

    # write the output frame
    if config['save_video']:
        if video_cur_frame % 35 == 0:  # take every 30 frames
            out.write(frame_out)

    # Display video
    cv2.imshow('Detecção de Vagas de Estacionamento', frame_out)
    save_dir = './frames/'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    cv2.imwrite(save_dir + 'frame%d.jpg' % video_cur_frame, frame_out)
    cv2.waitKey(40)
    # cv2.imshow('background mask', bw)
    k = cv2.waitKey(1)
    if k == ord('q'):
        break
    elif k == ord('c'):
        cv2.imwrite('frame%d.jpg' % video_cur_frame, frame_out)
    elif k == ord('j'):
        cap.set(cv2.CAP_PROP_POS_FRAMES, video_cur_frame+1000)  # jump to frame

cap.release()
if config['save_video']:
    out.release()
cv2.destroyAllWindows()
