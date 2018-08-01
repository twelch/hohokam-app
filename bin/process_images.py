#Example python process_images.py my_mbx_username input/base.tfw input output

from glob import glob
import os
import sys
from mapbox import Uploader

username = sys.argv[1]
world = sys.argv[2]
inDir = sys.argv[3]
outDir = sys.argv[4]

service = Uploader()

tifs = '%s/*.tif' % (inDir)
for absPath in glob(tifs):
  fullfile = os.path.basename(absPath)
  filename = os.path.splitext(fullfile)[0]
  worldCom = 'cp %s %s/%s.tfw' % (world, inDir, filename)
  print worldCom
  os.system(worldCom)
  outCom = 'gdal_translate -co tiled=yes -co compress=LZW -co BLOCKXSIZE=256 -co BLOCKYSIZE=256 -of Gtiff -a_srs EPSG:3857 -a_nodata 0 %s %s/%s' % (absPath, outDir, fullfile)
  print outCom
  os.system(outCom)

  with open('%s/%s' % (outDir, fullfile), 'r') as src:
    # Acquisition of credentials, staging of data, and upload
    # finalization is done by a single method in the Python SDK.
    tilesetName = '%s.%s' % (username, filename)
    print 'uploading %s, %s' % (tilesetName, fullfile)
    uploadResp = service.upload(src, tilesetName)
    print uploadResp


