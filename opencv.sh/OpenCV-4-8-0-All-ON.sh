#!/bin/bash
set -e

echo "Installing OpenCV 4.8.0 on your Jetson Nano"
echo "with Qt5, and build Python & C Examples for OpenCV"
echo "It will take 6.5 hours !"

# reveal the CUDA location
cd ~
sudo sh -c "echo '/usr/local/cuda/lib64' >> /etc/ld.so.conf.d/nvidia-tegra.conf"
sudo ldconfig


echo "Start PWM Cooling Fan to 50% Speed"

sudo sh -c 'echo 125 > /sys/devices/pwm-fan/target_pwm'

echo "Install the dependencies Start!!"

# install the dependencies
sudo apt-get install -y build-essential cmake git unzip pkg-config zlib1g-dev
sudo apt-get install -y libjpeg-dev libjpeg8-dev libjpeg-turbo8-dev libpng-dev libtiff-dev
sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev libglew-dev
sudo apt-get install -y libgtk2.0-dev libgtk-3-dev libcanberra-gtk*
sudo apt-get install -y python3-dev python3-numpy python3-pip
sudo apt-get install -y libxvidcore-dev libx264-dev libgtk-3-dev
sudo apt-get install -y libtbb2 libtbb-dev libdc1394-22-dev libxine2-dev
sudo apt-get install -y gstreamer1.0-tools libv4l-dev v4l-utils qv4l2 
sudo apt-get install -y libgstreamer-plugins-base1.0-dev libgstreamer-plugins-good1.0-dev
sudo apt-get install -y libavresample-dev libvorbis-dev libxine2-dev libtesseract-dev
sudo apt-get install -y libfaac-dev libmp3lame-dev libtheora-dev libpostproc-dev
sudo apt-get install -y libopencore-amrnb-dev libopencore-amrwb-dev
sudo apt-get install -y libopenblas-dev libatlas-base-dev libblas-dev
sudo apt-get install -y liblapack-dev liblapacke-dev libeigen3-dev gfortran
sudo apt-get install -y libhdf5-dev protobuf-compiler
sudo apt-get install -y libprotobuf-dev libgoogle-glog-dev libgflags-dev

echo "Install the dependencies Finished!!!"

# only install if you want Qt5
# to beautify your OpenCV GUI
echo "Install qt5 start"

sudo apt-get install -y qt5-default

echo "Install qt5 end!!"
echo "If qt5 is already installed your Jetson Nano dont's bother the message"


echo "Remove old versions or previous builds"
# remove old versions or previous builds
cd ~ 
sudo rm -rf opencv*

echo "Download the latest OpenCV version"
# download the latest version
git clone --depth=1 https://github.com/opencv/opencv.git
git clone --depth=1 https://github.com/opencv/opencv_contrib.git
echo "Download the latest OpenCV version END !!!"

echo "Set install dir for OpenCV Build"
# set install dir
cd ~/opencv
mkdir build
cd build

echo "run cmake with All Options ON!!!!"
# run cmake with All Options ON
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=/usr \
-D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
-D EIGEN_INCLUDE_PATH=/usr/include/eigen3 \
-D WITH_OPENCL=ON \
-D WITH_CUDA=ON \
-D CUDA_ARCH_BIN=5.3 \
-D CUDA_ARCH_PTX="" \
-D WITH_CUDNN=ON \
-D WITH_CUBLAS=ON \
-D ENABLE_FAST_MATH=ON \
-D CUDA_FAST_MATH=ON \
-D OPENCV_DNN_CUDA=ON \
-D ENABLE_NEON=ON \
-D WITH_QT=ON \
-D WITH_OPENMP=ON \
-D BUILD_TIFF=ON \
-D WITH_FFMPEG=ON \
-D WITH_GSTREAMER=ON \
-D WITH_TBB=ON \
-D BUILD_TBB=ON \
-D BUILD_TESTS=ON \
-D WITH_EIGEN=ON \
-D WITH_V4L=ON \
-D WITH_LIBV4L=ON \
-D WITH_PROTOBUF=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D INSTALL_C_EXAMPLES=ON \
-D INSTALL_PYTHON_EXAMPLES=ON \
-D PYTHON3_PACKAGES_PATH=/usr/lib/python3/dist-packages \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D BUILD_EXAMPLES=ON ..

# run make
#FREE_MEM="$(free -m | awk '/^Swap/ {print $2}')"
# Use "-j 4" only swap space is larger than 5.5GB
#if [[ "FREE_MEM" -gt "5500" ]]; then
#  NO_JOB=4
#else
#  echo "Due to limited swap, make only uses 1 core"
#  NO_JOB=1
#fi
#make -j ${NO_JOB} 

echo "Build OpenCV from sources using all 4 CPU cores in Jetson Nano!!!!"
echo "It will take 6.5 Hours! Please be patient !!!!"
make -j 4

#sudo rm -r /usr/include/opencv4/opencv2
echo "Installing New version of OpenCV to your Jetson Nano!!"
sudo make install
sudo ldconfig

# cleaning (frees 320 MB)
echo "Skipping clean OpenCV build setting"
#make clean

sudo apt-get update

echo "PWM Cooling Fan speed down to 25%"

sudo sh -c 'echo 65 > /sys/devices/pwm-fan/target_pwm'

echo "Congratulations!"
echo "You've successfully installed OpenCV 4.8.0 on your Jetson Nano"
echo "with Qt5, and build Python & C Examples for OpenCV"
echo "Delete previous opencv version in Jetpack 4.6.6"
sudo rm -r /usr/include/opencv4/opencv2

echo "If 'rm' command procuce dont't find '/usr/include/opencv4/opencv2' message"
echo "It's already removed!! and don't bother to run this script again!!"



