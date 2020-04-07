"""
multi.py, uses the sounddevice library to play multiple audio file to multiple output devices at the same time
Written by Devon Bray (dev@esologic.com)
"""
import time

import sounddevice
import soundfile
import threading
import os


DATA_TYPE = "float32"


def load_sound_file_into_memory(path):
    """
    Get the in-memory version of a given path to a wav file
    :param path: wav file to be loaded
    :return: audio_data, a 2D numpy array
    """

    audio_data, _ = soundfile.read(path, dtype=DATA_TYPE)
    return audio_data

def play_wav_on_index(audio_data, stream_object):
    """
    Play an audio file given as the result of `load_sound_file_into_memory`
    :param audio_data: A two-dimensional NumPy array
    :param stream_object: a sounddevice.OutputStream object that will immediately start playing any data written to it.
    :return: None, returns when the data has all been consumed
    """
    stream_object.write(audio_data)


def create_running_output_stream(index):
    """
    Create an sounddevice.OutputStream that writes to the device specified by index that is ready to be written to.
    You can immediately call `write` on this object with data and it will play on the device.
    :param index: the device index of the audio device to write to
    :return: a started sounddevice.OutputStream object ready to be written to
    """

    output = sounddevice.OutputStream(
        device=index,
        dtype=DATA_TYPE
    )
    output.start()
    return output


def get_sound_devices():
    virt_in = "CABLE Input MME"
    virt_in_dic = sounddevice.query_devices(device=virt_in)
    virt_out_idx = None
    for idx, device_dict in enumerate(sounddevice.query_devices()):
        if device_dict == virt_in_dic:
            virt_out_idx = idx
    if virt_out_idx is None:
        # ToDo: handle if Virtual cable is not installed
        raise ModuleNotFoundError
    phys_out = sounddevice.default.device[1]
    return [phys_out, virt_out_idx]


def play_file(file_location="D:\Dropbox\Soundboard\Alt andet\Destroy the child.wav"):

    file = load_sound_file_into_memory(file_location)

    indices = get_sound_devices()
    print(indices)
    streams = [create_running_output_stream(index) for index in indices]
    running = True

    print("Playing \'" + file_location.split("\\")[-1] + "\'")

    threads = [threading.Thread(target=play_wav_on_index, args=[file, stream]) for stream in streams]

    try:
        for thread in threads:
            thread.start()

        while running:
            time.sleep(.1)
            if True not in [t.isAlive() for t in threads]:
                running = False

        for thread, device_index in zip(threads, indices):
            print("Waiting for device", device_index, "to finish")
            thread.join()

    except KeyboardInterrupt:
        print("Stopping stream")
        for stream in streams:
            stream.abort(ignore_errors=True)
            stream.close()
        for t in threads:
            t.join()

play_file()
#get_sound_devices()