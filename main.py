import threading

import sounddevice as sd
import soundfile as sf


dtype = "float32"

def playFile(fileName: str):
    data, fs = sf.read(fileName, dtype="float32")

    streams_headset = [4, 7]

    os1 = sd.OutputStream(dtype=dtype, device=["CABLE Input MME", "Højttalere MME"])
    #os2 = sd.OutputStream(dtype=dtype, device=7)
    os1.start()
    os1.write(data)
    #os2.start()

    """t1 = threading.Thread(target=playStream(data, os1))
    t2 = threading.Thread(target=playStream(data, os2))
    ts = [t1, t2]
    for t in ts:
        t.start()"""

    #sd.check_input_settings()
    #sd.play(data, fs)
    #sd.play(data, fs, device=9)


def playStream(audio_data, stream_object: sd.OutputStream):
    stream_object.write(audio_data)

print(sd.query_devices())
#playFile("D:\Dropbox\Soundboard\Alt andet\Destroy the child.wav")