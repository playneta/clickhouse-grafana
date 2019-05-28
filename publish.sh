#!/bin/bash -x

ARCHIVE="playneta-clickhouse-grafana-1.8.4.zip"
URL="https://nexus-sonatype.playneta.gg/nexus/content/sites/grafana"

rm -rf dist
mkdir dist
cp -R app/dist/* dist
zip -r /tmp/${ARCHIVE} dist
curl --user admin:admin123 \
     --upload-file /tmp/${ARCHIVE} ${URL}/${ARCHIVE}
