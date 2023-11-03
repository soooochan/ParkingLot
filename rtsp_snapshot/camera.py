import cv2
import os
import time


if not os.path.exists('img'):
    os.makedirs('img')


cam = cv2.VideoCapture("rtsp://admin:admin123@192.168.10.140:554/stream1")

if not cam.isOpened():
    print("Could not open the camera.")
    exit()

count = 0 
last_saved_time = 0

while True:
    ret, img = cam.read()

    if not ret:
        print("Failed to grab frame.")
        break

    cv2.imshow("TEST", img)

    current_time = time.time()  #

    if current_time - last_saved_time >= 300:
        img_path = "img/snapshot_{}.png".format(current_time)
        cv2.imwrite(img_path, img)
        #print(f"Saved snapshot to {img_path}")
        last_saved_time = current_time  
        count += 1

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cam.release()
cv2.destroyAllWindows()

