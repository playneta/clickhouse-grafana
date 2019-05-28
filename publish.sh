#!/bin/bash -x

ARCHIVE="playneta-clickhouse-grafana-1.8.1.zip"
URL="https://nexus-sonatype.playneta.gg/nexus/content/sites/grafana"

zip -r /tmp/${ARCHIVE} app/dist
curl --user admin:admin123 \
     --upload-file /tmp/${ARCHIVE} ${URL}/${ARCHIVE}
