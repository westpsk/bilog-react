import pycristoforo as pyc
import json
country = pyc.get_shape("China")
with open('jiang_su_geo.json', 'r') as f:
  data = json.load(f)
  print(data)

fo = open("foo.txt", "w")
fo.write(str(country))
# points = pyc.geoloc_generation(country, 100, "China")
# print(points)

# AIzaSyCal3ThLdHLVrH-tjbPF_VhPOGR4Bg8OP4