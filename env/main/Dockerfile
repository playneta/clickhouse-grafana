FROM grafana/grafana:4.6.2

ENV GF_PATHS_PLUGINS /var/lib/grafana-plugins
ENV GF_INSTALL_PLUGINS grafana-piechart-panel, \
                       grafana-simple-json-datasource, \
                       vertamedia-clickhouse-datasource

ADD . ${GF_PATHS_PLUGINS}/playneta-clickhouse-grafana
