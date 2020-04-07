"""
Credit for bootstrap code:
 Devon Bray (dev@esologic.com)
"""
import argparse
import time

import sounddevice
import soundfile
import threading

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
    """
    A method for getting the sounddevices to play back on
    :return: a list with the default output device as first argument and virtual cable as second
    """
    virt_in = "CABLE Input MME"
    try:
        virt_in_dic = sounddevice.query_devices(device=virt_in)
    except ValueError:
        virt_in_dic = None
    virt_out_idx = None
    if virt_in_dic:
        for idx, device_dict in enumerate(sounddevice.query_devices()):
            if device_dict == virt_in_dic:
                virt_out_idx = idx
    phys_out = sounddevice.default.device[1]
    return [phys_out, virt_out_idx]


def play_file(file_location):
    """
    Method for playing a given file on default output device and virtual cable.
    Can be stopped with keyboard interrupt
    :param file_location: the full path of the file to play
    :return: None,  returns when file has been played or interrupted
    """
    print(file_location)
    file = load_sound_file_into_memory(file_location)

    indices = get_sound_devices()
    if indices[1]:
        streams = [create_running_output_stream(index) for index in indices]
    else:
        streams = [create_running_output_stream(indices[0])]

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


def build_parser():
    desc = "Input a .wave file, and it will be played back on Virtual Cable (pre-requisit) and default output device "
    parser = argparse.ArgumentParser(description=desc)
    parser.add_argument(
        "file", type=str, help=".wave file to play on default and Virtual Cable output"
    )
    return parser.parse_args()

file = build_parser().file
play_file(file)

