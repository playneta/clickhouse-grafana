#!/bin/bash -x

ARCHIVE="playneta-clickhouse-grafana-$1.zip"
URL="https://nexus-sonatype.playneta.gg/nexus/content/sites/grafana"

zip -r /tmp/${ARCHIVE} .
curl --user admin:admin123 \
     --upload-file /tmp/${ARCHIVE} ${URL}/playneta-clickhouse-grafana/versions/${1}/download
