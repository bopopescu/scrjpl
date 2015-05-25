from daarrt import *
import time

d = Daarrt()
batt = d.status()[0]

try :
    d.motor(40, 40)

    for i in range(10):
        time.sleep(1)
        b = d.status()[0]
        print batt, b, batt - b
except:
    pass
finally:
    time.sleep(0.5)
    d.motor(0,0)


# Resultats
# 1209 1176 33
# 1209 1140 69
# 1209 1102 107
# 1209 1039 170
# 1209 1152 57
# 1209 1167 42
# 1209 1126 83
# 1209 1134 75
# 1209 1164 45
# 1209 1167 42
